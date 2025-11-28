import bcrypt from 'bcrypt'
import validator from 'validator'
import { format } from 'date-fns'
import connect from '@/src/utils/db'
import sendMail from '@/src/utils/mailer'
import { NextResponse } from 'next/server'
import User from '../../../../models/User'
import History from '../../../../models/History'
import { generateOTP, validateOTP } from '@/src/utils/Otp'
import Notification from '../../../../models/Notification'


export const POST = async (req) => {

  try {
    const { name , email , password , code } = await req.json()
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

    if ( !code ) {
      const code = await generateOTP( email )

      await sendMail({
        code,
        to: email,
        text: `Email verification OTP for ${name}` ,
        subject : `Email verification OTP for ${name}`,
        link: {cap: 'For more information on Cod-en signup process, view ', address: '/help/account', title: 'sign up help page'},
        messages: [
          `Your email verification one-time-password is shown above`,
          'This OTP lasts for only five minutes. Use it quick before it expires'
        ],
      })

      return NextResponse.json({ error: 'OTP sent to email sucessfully' }, { status: 400 })
    }

    const valid = await validateOTP( email , code )

    if ( !valid ) return NextResponse.json({ error: 'OTP is not correct. Check email for OTP or resend' }, { status: 400 })

    // Hash password
    const hashedPassword = await bcrypt.hash(password.trim(), 10)

  // Create user
    const newUser = await User.create({ name , email, password: hashedPassword , provider: 'custom'})
    const history = await History.create({
      type: 'Profile',
      class: 'sign up',
      userId: newUser._id,
      status: 'Successful',
      target: newUser.name,
      title: 'Successful sign up',
      message: `Successful sign up to Cod-en at ${format(new Date.now(), "do MMMM, yyyy")}.`})
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
    await sendMail({
      to: newUser.email ,
      text: `Successful sign up to Cod-en` ,
      subject : `Successful sign up for ${newUser.name}`,
      messages: [
        "Welcome to Cod-en - Future of web development",
        `You signed up to cod-en at ${format(new Date.now(), "do MMMM, yyyy")}.`,
        `Next up? Create Project\n Get a tutorial pack\n Read Coden Blogs!`
      ],
      link: {cap: 'For more information, view ', address: `/history/${history._id}`, title: 'sign up history'}
    })
    return NextResponse.json(
      { id: newUser._id, name: newUser.name, email: newUser.email , provider: newUser.provider},
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message.includes('OTP') ? error.message : 'Something went wrong. Please try again' }, { status: 500 })
  }
}

export const PATCH = async (req) => {
  const { backup , email , question , answer } = await req.json()
  const usedEmail = email || backup
  connect()

  const user = await User.findOne({ $or: [{ backupEmail: usedEmail }, { email: usedEmail }] });
  
  try {
    if (!answer) return NextResponse.json({ error: 'A recovery answer is required for account recovery.' }, { status: 400 })
    if (!question) return NextResponse.json({ error: 'A recovery question is required for account recovery.' }, { status: 400 })
    if (!backup && !email) return NextResponse.json({ error: 'An email or backup-email is required for account recovery.' }, { status: 400 })

    if (!user) return NextResponse.json({ error: `Incorrect ${usedEmail === backup ? 'backup' : ''} email ${user.email}` }, { status: 400 })

    if (user.provider !== 'custom') return NextResponse.json({ error: 'User is not assigned with  a custom account.' }, { status: 400 })

    const set = user.recoveryQuestions.filter( set => set.question === question)
    
    if (set.length < 1) return NextResponse.json({ error: 'Incorrect recovery question.' }, { status: 400 })

    let isCorrect = false
    await Promise.all(
      user.recoveryQuestions.map(async ( set ) => {
        if (bcrypt.compare( answer.trim().toLocaleLowerCase() , set.answer )) {
          isCorrect = true
        }
      })
    )

    if (!isCorrect) return NextResponse.json({ error: 'Incorrect recovery answer.' }, { status: 400 })
    
    user.requestLogout = false
    user.password = await bcrypt.hash(usedEmail.split('@')[0], 10)

    await user.save()
    const history = await History.create({
      type: 'Profile',
      userId: user._id,
      target: user.name,
      class: 'recovery',
      status: 'Successful',
      title: 'Successful account recovery',
      message: `Password changed successfully at ${format(new Date.now(), "do MMMM, yyyy")}.`})
    await Notification.create({
      type: 'Profile',
      userId: user._id,
      target: user.name,
      class: 'recovery',
      status: 'Successful',
      link: `/history/${history._id}`,
      title: `Successful account recovery for ${user.name}`,
      message: `Password changed successfully at ${format(new Date.now(), "do MMMM, yyyy")}.`})
    await sendMail({
      to: user.email ,
      text: "Successful account recovery" ,
      subject : "Successful account recovery",
      messages: [
        `Account was recovered and password was changed successfully at ${format(new Date.now(), "do MMMM, yyyy")}.`
      ],
      link: {cap: 'For more information, view ', address: `/history/${history._id}`, title: 'recovery history'}
    })
    return NextResponse.json({ email: user.email , password: usedEmail.split('@')[0] }, {status: 200 })
  } catch (error) {
    if (user) await sendMail({
      to: user.email ,
      text: "Unsuccessful recovery attempt" ,
      subject : "Unsuccessful recovery attempt",
      messages: [
        `Password recovery attempt failed at ${format(new Date.now(), "do MMMM, yyyy")}.`,
        'If this was not you kindly ignore and ensure you secure log in credentials.'
      ],
      link: null
    })
    return NextResponse.json({ error: 'Something went wrong. Please try again' }, { status: 500 })
  }
}
