import mongoose from "mongoose"

const { Schema } = mongoose

const PhaseSchema = new Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false,
}})

const StageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  phase: {
    default: [],
    required: true,
    type: [PhaseSchema],
  },
})

const ProjectInstanceSchema = new Schema({
  ico: String, // project icon
  url: String, // this is the root file location
  link: String, // this is the web location
  pages: String,
  reason: String,
  currency: String,
  langFrom:  [ String ],
  userId: {
    type: String,
    required: true,
  },
  projectId: {
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

const ProjectInstance = mongoose.models.ProjectInstance || mongoose.model('ProjectInstance', ProjectInstanceSchema)

export default ProjectInstance