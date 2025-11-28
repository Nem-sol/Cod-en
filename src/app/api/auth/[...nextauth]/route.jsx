import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { format } from "date-fns";
import connect from "@/src/utils/db";
import sendMail from "@/src/utils/mailer"
import User from "../../../../models/User";
import { NextResponse } from "next/server";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import History from "../../../../models/History";
import Credentials from "next-auth/providers/credentials";
import Notification from "../../../../models/Notification";

const authHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      Google({
        id: "google",
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
      Github({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
      Credentials({
        id: "credentials",
        name: "credentials",
        async authorize(credentials) {
          await connect();
          const { email, password } = credentials;
          const user = await User.findOne({ email });
          if (!user) throw new Error("Incorrect email");
          if (user.provider !== "custom")
            throw new Error(`User is assigned to a ${user.provider} account`);

          const passCorrect = await bcrypt.compare(password, user.password);
          if (!passCorrect) throw new Error("Incorrect password");

          await Notification.create({
            read: false,
            important: true,
            type: "Log in",
            class: "request",
            target: user.name,
            userId: user._id.toString(),
            title: `Successful log in for ${user.name}`,
            message: `Successful Log in to your account at ${format(new Date(), "do MMMM, yyyy")}`,
          });

          await sendMail({
            link: null,
            to: user.email ,
            text: `Successful log in for ${user.name}` ,
            subject : `Successful log in for ${user.name}`,
            messages: [
              `Account was logged into at ${format(new Date(), "do MMMM, yyyy")}.`,
              'If this was not you, log into your account and change log-in details and request logout immediately'
            ],
          })

          return {
            name: user.name,
            email: user.email,
            id: user._id.toString(),
            provider: user.provider,
          };
        },
      }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
      async signIn({ user, account }) {
        // Check for recovery mode cookie
        const cookies = req.headers.cookie || req.headers.get("cookie") || "";
        const isRecovery = cookies.includes("recovery_mode=true");

        if (account.provider !== "credentials") {
          await connect();
          const existingUser = await User.findOne({ email: user.email });

          if (isRecovery) {
            // Clear the recovery cookie after reading it
            const response = NextResponse.json({ success: true });

            response.cookies.set("recovery_mode", "", {
              maxAge: 0,
              path: "/"
            });

            const userClient = await User.findOne({ 
              $or: [
                { backupEmail: user.email }, 
                { email: user.email }
              ]
            });
            
            if (!userClient)
              throw new Error(`Incorrect backup email "${user.email}"`);

            const hashedPass = await bcrypt.hash(
              user.email.split("@")[0],
              10
            );
            const oldEmail = userClient.email;
            userClient.name = user.name;
            userClient.email = user.email;
            userClient.backupEmail = null;
            userClient.requestLogout = false;
            userClient.password = hashedPass;
            userClient.recoveryQuestions = [];
            userClient.provider = account.provider;
            await userClient.save();

            user.id = userClient._id.toString();

            const history = await History.create({
              type: "Profile",
              class: "recovery",
              status: "Successful",
              userId: userClient._id,
              target: userClient.name,
              title: "Successful account recovery",
              message: `Account was recovered and password was changed successfully at ${format(new Date(), "do MMMM, yyyy")}.`,
            });

            await Notification.create({
              type: "Profile",
              class: "recovery",
              status: "Successful",
              userId: userClient._id,
              target: userClient.name,
              link: `/history/${history._id}`,
              title: `Successful account recovery for ${userClient.name}`,
              message: `Account was recovered and password was changed successfully at ${format(new Date(), "do MMMM, yyyy")}.`,
            });

            await sendMail({
              to: userClient.email,
              text: "Successful account recovery",
              subject: "Successful account recovery",
              messages: [
                `Account was recovered and password was changed successfully at ${format(new Date(), "do MMMM, yyyy")}.`
              ],
              link: {cap: 'For more information, view ', address: `/history/${history._id}`, title: 'recovery history'}
            });
            
            await sendMail({
              to: oldEmail,
              text: "Successful account recovery",
              subject: "Successful account recovery",
              messages: [
                `Account was recovered and password was changed successfully at ${format(new Date(), "do MMMM, yyyy")}.`
              ],
              link: {cap: 'For more information, view ', address: `/history/${history._id}`, title: 'recovery history'}
            });

            return true;
          } else if (existingUser) {
            if (existingUser.provider !== account.provider) throw new Error(
                `This email is already registered with ${existingUser.provider}. Please log in with ${existingUser.provider}.`
              );

            if ( existingUser.requestLogout ) {
              await Notification.create({
                type: "Log in",
                class: "request",
                status: "Failed",
                userId: existingUser._id,
                target: existingUser.name,
                title: `Failed account log in at ${format(new Date(), "do MMMM, yyyy")}`,
                message: `OAuth failure. Could not log into account due to user settings.`,
              });
              await sendMail({
                to: user.email ,
                text: `Log in failure for ${existingUser.name}`,
                subject : `Log in failure  in for ${existingUser.name}`,
                link: {cap: 'If you need to regain account access, kindly visit our', address: `/recovery`, title: 'recovery page'},
                messages: [
                  `Account for ${existingUser.email} could not be logged into because user has requested logout.`
                ],
              })
              throw new Error(' Log in attempt failed due to user settings')
            }

            user.id = existingUser._id.toString();

            await Notification.create({
              read: false,
              important: true,
              type: "Log in",
              class: "request",
              userId: existingUser._id,
              target: existingUser.name,
              title: `Successful log in for ${existingUser.name}`,
              message: `Successful Log in to your account at ${format(new Date(), "do MMMM, yyyy")}`,
            });

            await sendMail({
              link: null,
              to: existingUser.email,
              text: `Successful log in for ${existingUser.name}`,
              subject: `Successful log in for ${existingUser.name}`,
              messages: [
                `Account was logged into at ${format(new Date(), "do MMMM, yyyy")}.`,
                'If this was not you, log into your account and change log-in details and request logout immediately'
              ],
            });
            
            return true;
          } else {
            const hashedPass = await bcrypt.hash(
              user.email.split("@")[0],
              10
            );

            const newUser = await User.create({
              name: user.name,
              email: user.email,
              password: hashedPass,
              provider: account.provider,
            });

            user.id = newUser._id.toString();

            const history = await History.create({
              type: "Profile",
              class: "sign up",
              status: "Successful",
              userId: newUser._id,
              target: newUser.name,
              title: "Successful sign up",
              message: `Successful sign up to Cod-en at ${format(new Date(), "do MMMM, yyyy")}.`,
            });

            await Notification.create({
              read: false,
              important: true,
              type: "Profile",
              class: "sign up",
              userId: newUser._id,
              target: newUser.name,
              link: `/history/${history._id}`,
              title: `Successful sign up for ${newUser.name}`,
              message:
                `Welcome to Cod-en - Future of web development. Next up? Create Project\n Get a tutorial pack\n Read Coden Blogs!`,
            });

            await sendMail({
              to: newUser.email,
              text: `Successful sign up to Cod-en`,
              subject: `Successful sign up for ${newUser.name}`,
              messages: [
                "Welcome to Cod-en - Future of web development",
                `You signed up to cod-en at ${format(new Date(), "do MMMM, yyyy")}.`,
                `Next up? Create Project\n Get a tutorial pack\n Read Coden Blogs!`
              ],
              link: {cap: 'For more information, view ', address: `/history/${history._id}`, title: 'sign up history'}
            });
          }
        }

        return true;
      },

      async jwt({ token, account, user }) {
        if (user) {
          token.email = user.email;
          token.id = user.id || user._id?.toString();
          token.provider =
            !account || account.provider === "credentials"
              ? "custom"
              : account.provider;
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
      error: "/signin",
    },
  });

export { authHandler as GET, authHandler as POST };