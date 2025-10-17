import mongoose from "mongoose"

const { Schema } = mongoose

const RecoveryQuestionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
})

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  backupEmail: {
    type: String
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  provider: {
    type: String,
    required: true,
    default: 'custom',
  },
  password: {
    type: String,
    required: true,
  },
  recoveryQuestions: {
    type: [RecoveryQuestionSchema]
  },
  exclusive: {
    type: Boolean,
    default: false,
  }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

export default User