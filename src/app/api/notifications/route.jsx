import connect from '@/src/utils/db'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Notification from  '../../../models/Notification'

export const GET = async ( req ) => {
  
  await connect()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

    const notifications = await Notification.find({userId: token.id}).sort({createdAt: -1})

    if (!notifications || notifications.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(notifications, {status: 200})
  }
  catch(err){
    return NextResponse.json({error: err}, {status: 400})
  }
}

export const DELETE = async ( req ) => {
  
  await connect()
  const { id } = await req.json()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })
      
    const notification = await Notification.findOneAndDelete({_id: id})

    if (!notification) return NextResponse.json({error: 'Could not delete notification'}, { status: 400 })

    return NextResponse.json({mssg: 'Notification deleted'}, {status: 200})
  }
  catch(err){
    return NextResponse.json({error: err}, {status: 400})
  }
}

export const PATCH = async ( req ) => {
  
  await connect()
  const { id } = await req.json()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })
      
    const notification = await Notification.findOneAndUpdate({_id: id}, {read: true})

    if (!notification) return NextResponse.json({error: 'Could not update notification'}, { status: 400 })

    return NextResponse.json({mssg: 'Notification marked as read'}, {status: 200})
  }
  catch(err){
    return NextResponse.json({error: err}, {status: 400})
  }
}

export const POST = async ( req ) => {
  
  await connect()
  const { action } = await req.json()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

    if (action !== 'update' && action !== 'delete') return NextResponse.json({ error: `Could not process unrecognized action ; ${action}.` }, { status: 400 })
      
    const notification = action === 'update' ? 
      await Notification.updateMany({userId: token.id, read: false}, {read: true}) : 
      action === 'delete' && await Notification.find({userId: token.id})

    if (action === 'delete') try {
      await Promise.all(
        notification.map(async ( notification ) =>(Notification.findOneAndDelete(notification._id)))
      )
      return NextResponse.json({mssg: `Notifications ${action}d.`}, { status: 200 })
    } catch (error) {
      NextResponse.json({error: 'Error occured in the process'}, { status: 400 })
    }

    if (!notification) return NextResponse.json({error: `Could not ${action} notifications`}, { status: 400 })

    return NextResponse.json({mssg: `Notifications ${action}d.`}, {status: 200})
  }
  catch(err){
    return NextResponse.json({error: err}, {status: 400})
  }
}