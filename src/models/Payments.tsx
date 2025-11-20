import mongoose from "mongoose"

const { Schema } = mongoose

enum Providers {'Flutterwave' , 'Paystack'}
enum Status {'Pending' , 'Success', 'Failure'}

const PaymentSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  userId: String,
  targetId: String,
  provider: {
    type: String,
    default: 'Flutterwave',
    enum: ['Flutterwave', 'Paystack'],
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Success', 'Failure'],
  },
  reference: {
    unique: true,
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
    default: 'NGN',
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: 'gift'
  },
  method: {
    type: String,
    required: true,
  }
}, { timestamps: true })

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)

export default Payment