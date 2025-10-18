import mongoose from "mongoose"

const { Schema } = mongoose

const MessageSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Guest user',
  },
  type: {
    type: String,
    required: true,
    default: 'message',
  },
  email: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, {timestamps: true})

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)

export default Message