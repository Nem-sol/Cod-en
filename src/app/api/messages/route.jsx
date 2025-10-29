import validator from 'validator'
import connect from '@/src/utils/db'
import { NextResponse } from 'next/server'
import Message from '../../../models/Message'

export const POST = async ( req ) => {

  try{
    await connect()
    const { name , email , msg , type } = await req.json()

    if (!name.trim()) return NextResponse.json({ error: 'Please submit message with a name entry.' }, { status: 400 })

    if (!validator.isEmail(email)) return NextResponse.json({ error: 'Please submit message with a valid email entry.' }, { status: 400 })

    if (!type.trim()) return NextResponse.json({ error: 'Please submit message with a type entry.' }, { status: 400 })

    if (!msg.trim()) return NextResponse.json({ error: 'Please submit a non-empty message.' }, { status: 400 })

    await Message.create({ name , email , type , content: msg })
      
    return NextResponse.json({mssg: `${type[0].toLocaleUpperCase()}${type.toLocaleLowerCase().slice(1)} sent successfully. Cod-en will get back to you shortly.`}, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({error: 'Error occured in the process'}, { status: 400 })
  }
}