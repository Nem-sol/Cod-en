import bcrypt from 'bcrypt'
import validator from 'validator'
import { format } from 'date-fns'
import connect from '@/src/utils/db'
import User from '../../../models/User'
import { getToken } from 'next-auth/jwt'
import sendMail from '@/src/utils/mailer'
import { NextResponse } from 'next/server'
import History from '../../../models/History'
import { onTime } from '@/src/utils/apiTools'
import Notification from '../../../models/Notification'
import { generateOTP, validateOTP } from '@/src/utils/Otp'

export const GET = async (req) => {
  await connect()

  try {
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

    const userDetails = await User.findById( token.id )

    if (!userDetails) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (userDetails.requestLogout) return NextResponse({ email: null }, { status: 200 })

    return NextResponse.json({
      _id: userDetails._id,
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

    if (user.requestLogout) return NextResponse({ error: 'Could not update settings' }, { status: 400 })

    const passCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passCorrect) {
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `User settings could not be updated due to incorrect password`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json({ error: 'Incorrect password'}, { status: 400 })
    }

    // Validate
    if (!email && !newPassword && !name && !backup && !recoveryQuestions ) return NextResponse.json({ error: 'Please include a property for changes' }, { status: 400 })

    if (email && !validator.isEmail(email)) {
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `User settings could not be updated`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
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
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `User settings could not be updated`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json({ error: 'Invalid backup-email address' }, { status: 400 })
    }
    if (email && User.find({  $or: [{ backupEmail: email }, { email }]  }).length > 1) {
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `User settings could not be updated`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json(
        { error: 'Email address already in use' },
        { status: 400 }
      )
    }
    if (backup && (await User.find({  $or: [{ backupEmail: backup }, { email: backup }]  })).length > 1) {
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `User settings could not be updated`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json(
        { error: 'Backup email address already in use' },
        { status: 400 }
      )
    }
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
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `User settings could not be updated`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!onTime( user.updatedAt , 180 )) {
      await sendMail({
        to: user.email ,
        subject : `Profile settings alert`,
        text: `Profile update failure for ${user.name}` ,
        link: {cap: 'For more security advice, view ', address: `/help/security`, title: 'cod-en security approach'},
        messages: [
          `Unusual attempt to change settings for ${user.name} has been noticed.`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json(
        { error: 'User settings was changed just recently' },
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
          const hashedAnswer = await bcrypt.hash(set.answer.toLocaleLowerCase().trim(), 10);
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
      message: `Successful credential update at ${format(new Date.now(), "do MMMM, yyyy")}.`})
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
    await sendMail({
      link: {cap: 'For more information, view ', address: `/history/${history._id}`, title: 'recovery history'},
      to: user.email ,
      text: `Successful credential updates for ${updatedUser.name}` ,
      subject : `Successful credential updates for ${updatedUser.name}`,
      messages: [
        `User updated ${updateArr.join(', ')} successfully`,
      ],
    })
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
    if (user) {
      await sendMail({
        link: null,
        to: user.email ,
        text: `Credential updates failure for ${user.name}` ,
        subject : `Credential updates failure`,
        messages: [
          'Could not update credentials due to unknown error. Try again later!',
        ],
      })
      await Notification.create({
      read: false,
      important: true,
      type: 'Profile',
      class: 'update',
      userId: user._id,
      target: user.name,
      title: 'Credential updates failure',
      message: 'Could not update credentials due to unknown error. Try again later!'})
    }
    return NextResponse.json({ error: 'Something went wrong. Please try again' }, { status: 500 })
  }
}

export const PATCH = async (req) => {
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
    if (!passCorrect){
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `Recovery question delete attempt failed due to incorrect password`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    if (user.requestLogout) {
      await sendMail({
        link: null,
        to: user.email ,
        text: `Profile update failure for ${user.name}` ,
        subject : `Profile update failure  in for ${user.name}`,
        messages: [
          `Recovery question delete attempt failed due to user settings`,
          'Kindly recover account to continue with Cod-en'
        ],
      })
      return NextResponse({ error: 'Could not update settings' }, { status: 400 })
    }

    if (typeof i !== 'number') return NextResponse.json({ error: 'Number should be a figurative value' }, { status: 400 })

    if (!onTime( user.updatedAt , 180 )) {
      await sendMail({
        to: user.email ,
        subject : `Profile settings alert`,
        text: `Profile update failure for ${user.name}` ,
        link: {cap: 'For more security advice, view ', address: `/help/security}`, title: 'cod-en security approach'},
        messages: [
          `Unusual attempt to change settings for ${user.name} has been noticed.`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json(
        { error: 'User settings was changed just recently' },
        { status: 400 }
      )
    }
      
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
        message: `Recovery question deleted successfully at ${format(new Date.now(), "do MMMM, yyyy")}`,
      });

      await sendMail({
        link: null,
        to: user.email ,
        text: `Successful credential update for ${user.name}` ,
        subject : `Successful credential update for ${user.name}`,
        messages: [
          `Recovery question deleted successfully at ${format(new Date.now(), "do MMMM, yyyy")}`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })

      return NextResponse.json(
        { message: "Recovery question deleted successfully" },
        { status: 200 }
      );
    } else {

      await sendMail({
        link: null,
        to: user.email ,
        text: `Successful credential update for ${user.name}` ,
        subject : `Successful credential update for ${user.name}`,
        messages: [
          `Recovery question deleted successfully at ${format(new Date.now(), "do MMMM, yyyy")}`,
          'If this was not you, log into your account and change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json(
        { error: "Invalid recovery question index" },
        { status: 400 }
      );
    }
  }
  catch (error) {
    return NextResponse.json(
      { error: error.message || "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
};

export const DELETE = async ( req ) => {
  try {
    const { password } = await req.json();
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
    if (!passCorrect){
      await sendMail({
        link: null,
        to: user.email ,
        text: `Logout request failure for ${user.name}` ,
        subject : `Logout request failure for ${user.name}`,
        messages: [
          `Request-logout attempt failed due to incorrect password`,
          'If this was not you, log into your account, change log-in details and request logout immediately'
        ],
      })
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    if (user.requestLogout) return NextResponse.json({ error: "User has requested logout already" }, { status: 400 });

    if ( !code ) {
      const code = await generateOTP( user._id )
  
      await sendMail({
        code,
        to: email,
        text: `Logout request OTP for ${email}` ,
        subject : `Logout request OTP for ${email}`,
        link: {cap: 'For more information on Cod-en logout request process, view ', address: '/help/account', title: 'account help page'},
        messages: [
          `Your Logout request one-time-password is shown above`,
          'This OTP lasts for only ten minutes. Use it quick before it expires'
        ],
      })
  
      return NextResponse.json({ error: 'OTP sent to email sucessfully' }, { status: 400 })
    }

    const valid = await validateOTP( user._id , code )
    
    if ( !valid ) return NextResponse.json({ error: 'OTP is not correct. Check email for OTP or resend' }, { status: 400 })

    user.requestLogout = true
    await user.save()

    const history = await History.create({
      type: 'Profile',
      class: 'update',
      userId: user._id,
      target: user.name,
      status: 'Successful',
      title: 'Request-logout success',
      message: `User requested logout successfully at ${format(new Date.now(), "do MMMM, yyyy")}. Your account is now inaccessible. Recover account to continue to Cod-en`})

    await Notification.create({
      read: false,
      important: true,
      type: 'Profile',
      class: 'update',
      userId: user._id,
      target: user.name,
      link: `/history/${history._id.toString()}`,
      title: `${user.name} requested logout successfully at ${format(new Date.now(), "do MMMM, yyyy")}. Your account is now inaccessible. Recover account to continue to Cod-en`,
      message: `Successful credential updates. User updated ${updateArr.join(', ')} successfully`})

    await sendMail({
      to: user.email ,
      text: `Request-logout success for ${user.name}` ,
      subject : `Request-logout success for ${user.name}`,
      link: {cap: 'For more information on account recovery, view ', address: 'help/account', title: 'recovery guides'},
      messages: [
        'You have been successfully logged out of Cod-en via "request logout" attempt',
        'This means that you will be unable to access notifications, projects, inbox and all Cod-en services and you will be logged out from Cod-en across all devices.',
        'You can gain access by recovering your account from our recoovery page through recovery questions or OAuth',
        'Waiting for your return ...',
        'The Cod-en team'
      ],
    })
    return NextResponse.json({ status: 200 })

  } catch (error) {
    return NextResponse.json(
      { error: error.message.includes('OTP') ? error.message : "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}