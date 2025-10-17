import connect from '@/src/utils/db'
import { getToken } from 'next-auth/jwt'
import User from  '../../../models/User'
import { NextResponse } from 'next/server'
import Inbox from  '../../../models/Inbox'

export const GET = async (req) => {
  
  await connect()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized requet declined' }, { status: 401 })

    const userRole = await User.findById(token.id).role

    const inbox = userRole === 'admin' ? 
      await Inbox.find({status: 'active'}).sort({createdAt: -1}) : 
      await Inbox.find({userId: token.id}).sort({createdAt: -1})

    if (!inbox || inbox.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(inbox, {status: 200})
  }
  catch(err){
    return NextResponse.json({error: err}, {status: 400})
  }
}