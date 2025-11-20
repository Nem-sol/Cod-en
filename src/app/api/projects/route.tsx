import connect from '@/src/utils/db'
import { getToken } from 'next-auth/jwt'
import  User from  '../../../models/User'
import  Project from  '../../../models/Project'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  
  await connect()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })
    
    const user = await User.findById(token.id).select('role')

    const projects = await Project.find(user?.role === 'admin' ? {} : {userId: token.id}).sort({createdAt: -1})

    if (!projects || projects.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(projects, {status: 200})
  }
  catch(err: unknown){
    if (err instanceof Error) return NextResponse.json({error: err.message}, {status: 400})
  }
}