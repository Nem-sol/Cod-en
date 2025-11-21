import mongoose from 'mongoose'

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO || "")
  } catch ( error ) {
    console.error(error)
    throw new Error('Unexpected server error. Try again later')
  }
}

export default connect