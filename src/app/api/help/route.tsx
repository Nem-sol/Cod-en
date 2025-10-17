import connect from '@/src/utils/db'
import Help from  '../../../models/Help'
import { NextResponse } from 'next/server'

export const GET = async () => {
  
  await connect()

  try{
    const help = await Help.find({}).sort({createdAt: -1})

    if (!help || help.length === 0) return NextResponse.json([], { status: 200 })

    return NextResponse.json(help, {status: 200})
  }
  catch(err){
    return NextResponse.json({error: err}, {status: 400})
  }
}