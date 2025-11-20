import mongoose from "mongoose"

const { Schema } = mongoose

const messageSchema = new Schema({
  sent: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: 'message',
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  }
}, {timestamps: true})

const InboxSchema = new Schema({
  title: {
    required: true,
    type: String
  },
  projectId:{
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  userId: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    required: true,
    default: 'active',
  },
  messages: {
    default: [],
    type: [messageSchema],
  }
}, {timestamps: true})

const Inbox = mongoose.models.Inbox || mongoose.model('Inbox', InboxSchema)

export default Inbox