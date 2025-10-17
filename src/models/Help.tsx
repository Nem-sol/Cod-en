import mongoose from "mongoose"

const { Schema } = mongoose

const HelpSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  related: {
    type: [ String ]
  },
}, {timestamps: true})

const Help = mongoose.models.Help || mongoose.model('Help', HelpSchema)

export default Help