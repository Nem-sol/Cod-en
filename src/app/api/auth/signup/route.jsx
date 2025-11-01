import bcrypt from 'bcrypt'
import validator from 'validator'
import connect from '@/src/utils/db'
import { NextResponse } from 'next/server'
import User from '../../../../models/User'
import History from '../../../../models/History'
import Notification from '../../../../models/Notification'


export const POST = async (req) => {
  const { name , email , password } = await req.json()
  await connect()

  // Validate
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }
  if (!validator.isEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  const trimmedName = name.trim()
  if (trimmedName.length < 4 || name.length > 40) {
    return NextResponse.json(
      { error: 'Username must be between 4–40 characters' },
      { status: 400 }
    )
  }
  if (password.trim().length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    )
  }

  // Unique checks
  const emailExists = await User.findOne({ email }).select('_id')
  if (emailExists) return NextResponse.json({ error: 'Email already in use' }, { status: 400 })

  // Hash password
  const hashedPassword = await bcrypt.hash(password.trim(), 10)

  // Create user
  try {
    const newUser = await User.create({ name , email, password: hashedPassword , provider: 'custom'})
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
      link: `/history/${history._id.toString()}`,
      title: `Successful sign up for ${newUser.name}`,
      message: 'Welcome to Cod-en future of web development. Next up? Create Project  Get a tutorial pack   Read Coden Blogs!'})
    return NextResponse.json(
      { id: newUser._id, name: newUser.name, email: newUser.email , provider: newUser.provider},
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong. Please try again' }, { status: 500 })
  }
}

export const PATCH = async (req) => {
  const { backup , email , question , answer } = req.json()
  const usedEmail = email || backup
  connect()

  const user = await User.findOne({ $or: [{ backupEmail }, { email }] });
  
  try {
    if (!answer) return NextResponse.json({ error: 'A recovery answer is required for account recovery.' }, { status: 400 })
    if (!question) return NextResponse.json({ error: 'A recovery question is required for account recovery.' }, { status: 400 })
    if (!backup && !email) return NextResponse.json({ error: 'An email or backup-email is required for account recovery.' }, { status: 400 })

    if (!user) return NextResponse.json({ error: `Incorrect backup email ${user.email}` }, { status: 400 })

    if (user.provider !== 'custom') return NextResponse.json({ error: 'User is assigned with  a custom account.' }, { status: 400 })

    const set = user.recoveryQuestion.filter( set => set.question === question)
    
    if (set.length < 1) return NextResponse.json({ error: 'Incorrect recovery question.' }, { status: 400 })

    const isCorrect = await bcrypt.compare( answer.trim().toLocaleLowerCase() , set.answer )

    if (!isCorrect) return NextResponse.json({ error: 'Incorrect recovery answer.' }, { status: 400 })
    
    user.password = await bcrypt.hash(usedEmail.split('@')[0], 10)

    await user.save()
    const history = await History.create({
      type: 'Profile',
      userId: user._id,
      target: user.name,
      class: 'recovery',
      status: 'Successful',
      title: 'Successful account recovery',
      message: `Password changed successfully at ${new Date().toLocaleString()}.`})
    await Notification.create({
      type: 'Profile',
      userId: user._id,
      target: user.name,
      class: 'recovery',
      status: 'Successful',
      link: `/history/${history._id}`,
      title: `Successful account recovery for ${user.name}`,
      message: `Password changed successfully at ${new Date().toLocaleString()}.`})
    return NextResponse.json({ email: user.email , password: user.email.split('@')[0] }, {status: 200 })
  } catch (error) {
    if (user) await Notification.create({
    type: 'Profile',
    status: 'Failed',
    userId: user._id,
    target: user.name,
    class: 'recovery',
    title: `Failed account recovery for ${user.name}`,
    message: `Password recovery attempt failed at ${new Date().toLocaleString()}.`})
    return NextResponse.json({ error: 'Something went wrong. Please try again' }, { status: 500 })
  }
}
