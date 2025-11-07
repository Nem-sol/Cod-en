import mongoose from "mongoose"

const { Schema } = mongoose

const OTPSchema = new Schema({
  code: {
    unique: true,
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  validity: {
    type: Number,
    required: true,
  },
  expired: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true})

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema)

export default OTP