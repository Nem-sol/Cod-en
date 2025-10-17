import mongoose from "mongoose"

const { Schema } = mongoose

const NotifiactionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
    default: 'User',
  },
  userId: {
    type: String,
    required: true,
  },
  important: {
    type: Boolean,
    required: true,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  class: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
}, {timestamps: true})

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotifiactionSchema)

export default Notification