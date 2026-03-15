import mongoose from "mongoose"

const { Schema } = mongoose

const FAQSchema = new Schema({
  question: {
    type: String,
    unique: true,
    required: true,
  },
  answer: {
    default: '',
    type: String,
  }
}, { timestamps: true })

const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema)

export default FAQ