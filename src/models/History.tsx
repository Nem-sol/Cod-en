import mongoose from "mongoose"

const { Schema } = mongoose

const HistorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
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

const History = mongoose.models.History || mongoose.model('History', HistorySchema)

export default History