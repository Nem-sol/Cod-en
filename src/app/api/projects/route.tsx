import connect from '@/src/utils/db'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import  Project from  '../../../models/Project'

export const GET = async (req: any) => {
  
  await connect()

  try{
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })

    const projects = await Project.find({userId: token.id}).sort({createdAt: -1})

    if (!projects || projects.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(projects, {status: 200})
  }
  catch(err: any){
    return NextResponse.json({error: err.message}, {status: 400})
  }
}