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
      backup: userDetails.backupEmail,
      exclusive: userDetails.exclusive,
      recoveryQuestions: [...userDetails.recoveryQuestions.map((set) => set.question)],
    }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export const POST = async (req) => {
  const { name , email , password , backup , pass: newPassword } = await req.json()
  await connect()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

  const user = await User.findById( token.id )

  if (!user) return NextResponse.json({ error: 'Could not find user' }, { status: 400 })

  const passCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!passCorrect) return NextResponse.json({ error: 'Incorrect password'}, { status: 400 })

  // Validate
  if (!email && !newPassword && !name && !backup ) return NextResponse.json({ error: 'Please include a property for changes' }, { status: 400 })

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
  if ( name && (name.trim().length < 4 || name.length > 40)) {
    return NextResponse.json(
      { error: 'Username must be between 4–40 characters' },
      { status: 400 }
    )
  }

  if (newPassword.trim().length < 6) {
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

  // Hash password
  const hashedPassword = await bcrypt.hash(newPassword.trim(), 10)

  let updateArr = []
  name && updateArr.push('name')
  email && updateArr.push('email')
  backup && updateArr.push('backup-email')
  newPassword && updateArr.push('password')
  const n = name ? name : user.name
  const e = email ? email : user.email
  const b = backup ? backup : user.backupEmail
  const p = newPassword ? hashedPassword : user.password


  try {
    const updatedUser = await User.findByIdAndUpdate( token.id , { name: n , email: e, password: p , backupEmail: b})
    const history = await History.create({
      type: 'Profile',
      class: 'update',
      userId: user._id,
      target: updatedUser.name,
      status: 'Successful',
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
    return NextResponse.json(
      { name: updatedUser.name, email: updatedUser.email, backupEmail: updatedUser.backupEmail , provider: updatedUser.provider},
      { status: 201 }
    )
  } catch (error) {
    await Notification.create({
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

