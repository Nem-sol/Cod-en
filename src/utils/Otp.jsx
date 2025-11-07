import connect from "./db"
import OTP from "../models/OTP"

const generateOTPCode = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const generateOTP = async ( userId , validity = 10) => {
  await connect();

  const code = generateOTPCode(8);
  await OTP.create({
    code,
    userId,
    validity,
  });

  return code;
}

export const validateOTP = async ( userId , code ) => {
  try {
    await connect()

    if (!userId) throw new Error('User not found')

    const otp = OTP.find({ userId }).sort({createdAt: -1}).limit(1)

    if ( !otp || otp.length === 0 ) throw new Error('No OTP generated for user')

    const latest = otp[0]
    const validity = Number(latest.validity);
    
    if (latest.code !== code.trim().toUpperCase()) throw new Error("Incorrect OTP code");

    if ( otp.expired || latest.expired ) throw new Error('OTP expired')

    // Compute expiration time safely (no timezone issues)
    // createdAt is stored as UTC in MongoDB by default
    const nowUTC = Date.now(); // also UTC
    const createdAtUTC = new Date(latest.createdAt).getTime();
    const expiryUTC = createdAtUTC + validity * 60 * 1000;

    if (nowUTC > expiryUTC) {
      latest.expired = true;
      await latest.save();
      throw new Error("OTP expired");
    }

    latest.expired = true
    await latest.save()
    return true
  } catch (error) {
    throw new Error('Unexpected error. Try again later')
  }
}