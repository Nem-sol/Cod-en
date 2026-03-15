import connect from '@/src/utils/db'
import { getToken } from 'next-auth/jwt'
import User from  '../../../models/User'
import Inbox from  '../../../models/Inbox'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  
  await connect()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized requet declined' }, { status: 401 })

    const user = await User.findById(token.id).select('role')

    const inbox = await Inbox.find(user?.role === 'admin' ? {} : {userId: token.id}).sort({createdAt: -1})

    if (!inbox || inbox.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(inbox, {status: 200})
  }
  catch(err){
    if (err instanceof Error ) return NextResponse.json({error: err}, {status: 400})
  }
}