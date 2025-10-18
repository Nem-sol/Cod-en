import bcrypt from 'bcrypt'
import validator from 'validator'
import connect from '@/src/utils/db'
import { getToken } from 'next-auth/jwt'
import User from '../../../models/User'
import { NextResponse } from 'next/server'
import History from '../../../models/History'
import Notification from '../../../models/Notification'

export const GET = async (req) => {
  await connect()

  try {
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

    const userDetails = await User.findById( token.id )

    if (!userDetails) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      role: userDetails.role,
      name: userDetails.name,
      email: userDetails.email,
      created: userDetails.createdAt,
      provider: userDetails.provider,
      exclusive: userDetails.exclusive,
      backupEmail: userDetails.backupEmail,
      recoveryQuestions: [...userDetails.recoveryQuestions.map((set) => set.question)],
    }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export const POST = async (req) => {
  const { name , email , password , backup , newPassword , recoveryQuestions } = await req.json()
  await connect()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!password) return NextResponse.json({ error: 'Password required to update changes' }, { status: 400 })

  if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

  const user = await User.findById( token.id )
  try {
    if (!user) return NextResponse.json({ error: 'Could not find user account' }, { status: 400 })

    const passCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passCorrect) return NextResponse.json({ error: 'Incorrect password'}, { status: 400 })

    // Validate
    if (!email && !newPassword && !name && !backup && !recoveryQuestions ) return NextResponse.json({ error: 'Please include a property for changes' }, { status: 400 })

    if (email && !validator.isEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (backup && !validator.isEmail(backup)) {
      await Notification.create({
        read: false,
        important: true,
        type: 'Profile',
        class: 'update',
        userId: user._id,
        target: updatedUser.name,
        title: `Credential update failed`,
        message: `Backup-email change for ${updatedUser.name} failed due to invalid address`})
      return NextResponse.json({ error: 'Invalid backup-email address' }, { status: 400 })
    }
    if (email && backup && (User.find({email}) || User.find({backupEmail: backup}) || user.find({email: backup}) || User.find({backupEmail: email}))) return NextResponse.json(
        { error: 'Email address already in use' },
        { status: 400 }
      )
    if ( name && (name.trim().length < 4 || name.length > 40)) {
      return NextResponse.json(
        { error: 'Username must be between 4–40 characters' },
        { status: 400 }
      )
    }

    if (newPassword && newPassword.trim().length < 6) {
      await Notification.create({
        read: false,
        important: true,
        type: 'Profile',
        class: 'update',
        userId: user._id,
        target: updatedUser.name,
        title: `Credential update failed`,
        message: `Password change for ${updatedUser.name} failed. Password does not satisfy requirements.`})
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    let updateArr = []
    name && updateArr.push('name')
    email && updateArr.push('email')
    backup && updateArr.push('backup-email')
    newPassword && updateArr.push('password')
    recoveryQuestions && recoveryQuestions.length > 0 && updateArr.push('recovery questions')
    const n = name ? name : user.name
    const e = email ? email : user.email
    const b = backup ? backup : user.backupEmail
    const p = newPassword ? await bcrypt.hash(newPassword.trim(), 10) : user.password
    const r = recoveryQuestions ? [ ...user.recoveryQuestions,
    ...(await Promise.all(
      recoveryQuestions
        .filter((set) => set.question?.trim() && set.answer?.trim())
        .filter((set, i, self) => i === self.findIndex((s) =>
          s.question.trim().toLowerCase() === set.question.trim().toLowerCase())
        )
        .map(async (set) => {
          const hashedAnswer = await bcrypt.hash(set.answer.trim(), 10);
          return {
            question: set.question.trim(),
            answer: hashedAnswer
          }
        })
      ))
    ] : user.recoveryQuestions

    const updatedUser = await User.findByIdAndUpdate( token.id , { name: n , email: e, password: p , backupEmail: b, recoveryQuestions: r})
    const history = await History.create({
      type: 'Profile',
      class: 'update',
      userId: user._id,
      status: 'Successful',
      target: updatedUser.name,
      title: 'Successful update',
      message: `Successful credential update at ${new Date().toLocaleString()}.`})
    await Notification.create({
      read: false,
      important: true,
      type: 'Profile',
      class: 'update',
      userId: user._id,
      target: updatedUser.name,
      link: `/history/${history._id.toString()}`,
      title: `Successful credential updates for ${updatedUser.name}`,
      message: `Successful credential updates. User updated ${updateArr.join(', ')} successfully`})
    return NextResponse.json({ 
      name: n,
      email: e,
      backupEmail: b,
      provider: updatedUser.provider,
      recoveryQuestions: [...r.map((set) => set.question)],
    },
    { status: 201 }
    )
  } catch (error) {
    if (user) await Notification.create({
      read: false,
      important: true,
      type: 'Profile',
      class: 'update',
      userId: user._id,
      target: user.name,
      title: 'Credential updates failure',
      message: 'Could not update credentials due to unknown error. Try again later!'})
    return NextResponse.json({ error: 'Something went wrong. Please try again' }, { status: 500 })
  }
}

export const DELETE = async (req) => {
  try {
    const { i , password } = await req.json();
    await connect();

    if (!password)
      return NextResponse.json(
        { error: "Password required to update changes" },
        { status: 400 }
      );

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token)
      return NextResponse.json(
        { error: "Unauthorized request declined" },
        { status: 401 }
      );

    const user = await User.findById(token.id);
    if (!user)
      return NextResponse.json(
        { error: "Could not find user account" },
        { status: 404 }
      );

    const passCorrect = await bcrypt.compare(password, user.password);
    if (!passCorrect)
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });

    console.log(typeof i)
    if (typeof i !== 'number') return NextResponse.json({ error: 'Number should be a figurative value' }, { status: 400 })
      
    if (i >= 0 && i < user.recoveryQuestions.length) {
      user.recoveryQuestions.splice(i, 1);
      await user.save();

      await Notification.create({
        read: false,
        important: true,
        type: "Profile",
        class: "update",
        userId: user._id,
        target: user.name,
        title: `Successful credential update for ${user.name}`,
        message: `Recovery question deleted successfully at ${new Date().toLocaleString()}`,
      });

      return NextResponse.json(
        { message: "Recovery question deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid recovery question index" },
        { status: 400 }
      );
    }
  }
  catch (error) {
    await Notification.create({
      read: false,
      important: true,
      type: "Profile",
      class: "update",
      userId: undefined,
      target: "Unknown user",
      title: "Credential update failure",
      message: `Could not delete recovery question: ${error.message}`,
    });

    return NextResponse.json(
      { error: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};

