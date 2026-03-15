import connect from '@/src/utils/db'
import { cookies } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import  User from  '../../../models/User'
import  Project from  '../../../models/Project'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  
  await connect()
  const cookie = await cookies()
  const require = cookie.get('require')?.value === 'true'

  try{
    if ( require ) {
      const projects = await Project.find({}).sort({ createdAt: -1 }).select('userId _id type scale service name about url provider link ico createdAt sector')

      if (!projects || projects.length === 0) return NextResponse.json([], { status: 200 })

      const response = NextResponse.json({ success: true });

      response.cookies.set("require", "", { maxAge: 0, path: "/" });

      return NextResponse.json( projects , { status: 200 })
    }

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