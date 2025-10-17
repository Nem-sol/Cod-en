import mongoose from "mongoose"

const { Schema } = mongoose

const StageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  phase: {
    default: [],
    required: true,
    type: [{
      type: String,
      completed: {
        type: Boolean,
        default: false,
    }}],
  },
})

const ProjectSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  paymentLevel: {
    default: 0,
    type: Number,
    required: true,
  },
  link: {
    type: String
  },
  signed: {
    type: Boolean,
    required: true,
    default: false,
  },
  class: {
    type: String,
    required: true,
  },
  concept: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'waiting',
  },
  sector: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    default: 'custom',
  },
  type: {
    type: String,
    required: true,
  },
  features: {
    default: [],
    required: true,
    type: [ String ],
  },
  process: {
    default: [],
    required: true,
    type: [ StageSchema ],
  }
}, {timestamps: true})

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema)

export default Project