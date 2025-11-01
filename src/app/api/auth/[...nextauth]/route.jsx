import bcrypt from "bcrypt";
import NextAuth from 'next-auth'
import connect from '@/src/utils/db'
import User from '../../../../models/User'
import History from '../../../../models/History'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials";
import Notification from '../../../../models/Notification'

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      id: 'credentials',
      name: 'credentials',
      async authorize(credentials){
        await connect()

        const { email, password } = credentials;

        const user = await User.findOne({ email });

        if (!user) throw new Error("Incorrect email");
        if (user.provider !== 'custom') throw new Error(`User is assigned to a ${user.provider} account`)

        const passCorrect = await bcrypt.compare(
          password,
          user.password
        );

        if (!passCorrect) throw new Error("Incorrect password");
        await Notification.create({
          read: false,
          important: true,
          type: 'Log in',
          class: 'request',
          target: user.name,
          userId: user._id.toString(),
          title: `Successful log in for ${user.name}`,
          message: `Succesful Log in to your account at ${new Date().toLocaleString()}`})

        return { id: user._id.toString(), email: user.email, name: user.name , provider: user.provider};
      }
    })
  ],
  
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      const url = new URL(account?.callbackUrl || process.env.NEXTAUTH_URL);
      const isRecovery = url.searchParams.get("recovery") === "true";
      // Only run for OAuth providers (Google/GitHub)
      if (account.provider !== 'credentials') {
        await connect();
        const existingUser = await User.findOne({ email: user.email });

        if (isRecovery){
          const userClient = await User.findOne({ backupEmail: user.email });
          if (!userClient) throw new Error( `Incorrect backup email "${user.email}"`)
          const hashedPass = await bcrypt.hash(user.email.split('@')[0], 10)
          userClient.email = user.email
          userClient.backupEmail = null
          userClient.password = hashedPass
          userClient.provider = account.provider
          await userClient.save()
          user.id = userClient._id.toString();
          const history = await History.create({
            type: 'Profile',
            class: 'recovery',
            status: 'Successful',
            userId: userClient._id,
            target: userClient.name,
            title: 'Successful account recovery',
            message: `Password changed successfully at ${new Date().toLocaleString()}.`})
          await Notification.create({
            type: 'Profile',
            class: 'recovery',
            status: 'Successful',
            userId: userClient._id,
            target: userClient.name,
            link: `/history/${history._id}`,
            title: `Successful account recovery for ${userClient.name}`,
            message: `Password changed successfully at ${new Date().toLocaleString()}.`})
          return true
        }

        else if (existingUser) {
          // Block if trying to log in with a different provider
          if (existingUser.provider !== account.provider) {
            throw new Error(
              `This email is already registered with ${existingUser.provider}. Please log in with ${existingUser.provider}.`
            )
          }
          // Allow if same provider
          user.id = existingUser._id.toString()
          await Notification.create({
            read: false,
            important: true,
            type: 'Log in',
            class: 'request',
            userId: existingUser._id,
            target: existingUser.name,
            title: `Successful log in for ${existingUser.name}`,
            message: `Succesful Log in to your account at ${new Date().toLocaleString()}`})
          return true
        }
        else if (!existingUser) {
          const hashedPass = await bcrypt.hash(user.email.split('@')[0], 10)
          // Create user in DB on first login
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            password: hashedPass,
            provider: account.provider,
          });
          user.id = newUser._id.toString();
          const history = await History.create({
            type: 'Profile',
            class: 'sign up',
            status: 'Successful',
            userId: newUser._id,
            target: newUser.name,
            title: 'Successful sign up',
            message: `Successful sign up to Cod-en at ${new Date().toLocaleString()}.`})
          await Notification.create({
            read: false,
            important: true,
            type: 'Profile',
            class: 'sign up',
            userId: newUser._id,
            target: newUser.name,
            link: `/history/${history._id}`,
            title: `Successful sign up for ${newUser.name}`,
            message: 'Welcome to Cod-en - Future of web development. Next up? Create Project  Get a tutorial pack   Read Coden Blogs!'})
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.email = user.email;
        token.id = user.id || user._id?.toString();
        token.provider = !account ? "custom" : account.provider !== 'credentials' ? account.provider : 'custom';
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    error: '/signin'
  },
})

export { handler as GET, handler as POST }