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
  ico: String, // project icon
  url: String, // this is the root file location,
  link: String, // this is the web location
  pages: String,
  reason: String,
  langFrom:  [ String ],
  userId: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  concept: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    min: 0,
    default: 0,
    type: Number,
    required: true,
  },
  sector: {
    type: String,
    required: true,
  },
  signed: {
    type: Boolean,
    required: true,
    default: false,
  },
  rate: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
  },
  scale: {
    type: String,
    enum: ['large', 'small', 'medium'],
  },
  type: {
    type: String,
    required: true,
    enum: ['full', 'part'],
  },
  provider: {
    type: String,
    required: true,
    default: 'custom',
    enum: ['custom', 'domain', 'vercel', 'github'],
  },
  class: {
    type: String,
    required: true,
    enum: ['front', 'back', 'full', 'os', 'ms', 'androids'],
  },
  lang: {
    required: true,
    type: [ String ],
    default: ['auto'],
  },
  paymentLevel: {
    min: 0,
    max: 100,
    default: 0,
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'waiting',
    enum: ['waiting', 'terminated', 'completed', 'active'],
  },
  service: {
    type: String,
    required: true,
    enum: [
      'upgrade',
      'contract',
      'transcript',
      'web application',
      'software application',
      'quality-assurance testing'
    ],
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