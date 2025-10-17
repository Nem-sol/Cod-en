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
