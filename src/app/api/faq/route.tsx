import connect from '@/src/utils/db'
import User from '@/src/models/User'
import FAQ from  '../../../models/FAQ'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async () => {
  
  await connect()

  try{
    const faq = await FAQ.find({}).sort({createdAt: -1})

    if (!faq || faq.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(faq, {status: 200})
  }
  catch (err) {
    return NextResponse.json({error: 'Failed to get FAQs'}, {status: 400})
  }
}

export const POST = async ( req: NextRequest ) => {

  await connect()

  const { question } = await req.json()
  
  try {
    if ( !question.trim() ) return NextResponse.json({ error: 'No question was asked.'} , { status: 400 })

    const exists = await FAQ.find({ question })

    if ( exists ) return NextResponse.json({ error: 'Question already asked. '} , { status: 400 })

    await FAQ.create({ question })
    return NextResponse.json({ message: 'Question sent. Cod-en will answer shortly. '} , { status: 200 })
    
  } catch {
    return NextResponse.json({error: 'Failed to add FAQs'}, {status: 400})
  }
}

export const PATCH = async ( req: NextRequest ) => {

  await connect()

  const { question , answer } = await req.json()
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token) return NextResponse.json({ error: 'Unauthorized request declined' }, { status: 401 })
  
  try {
    const user = await User.findById( token.id )
    if ( user?.role !== 'admin' ) return NextResponse.json({ error: 'Only admins can answer questions' }, { status: 401 })

    if ( !question.trim() ) return NextResponse.json({ error: 'No question was provided.'} , { status: 400 })
    if ( !answer.trim() ) return NextResponse.json({ error: 'No answer was provided.'} , { status: 400 })

    const exists = await FAQ.find({ question })

    if ( !exists ) return NextResponse.json({ error: 'Could not find question. '} , { status: 404 })

    await FAQ.updateOne({ question }, { answer })
    return NextResponse.json({ message: 'Question answered'} , { status: 200 })
    
  } catch {
    return NextResponse.json({error: 'Failed to answer question'}, {status: 400})
  }
}