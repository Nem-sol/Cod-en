import connect from "./db"
import OTP from "../models/OTP"
import { onTime } from "./apiTools";

const generateOTPCode = (length = 8) => {
  let code = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) code += chars.charAt(Math.floor(Math.random() * chars.length))
  return code;
};

export const generateOTP = async ( userId , validity = 10 ) => {
  await connect();

  const code = generateOTPCode(8);

  await OTP.create({
    code,
    userId,
    validity,
  });

  return code;
}

export const validateOTP = async ( id , code ) => {
  try {
    await connect()
    const userId = String(id)

    if (!userId) throw new Error('User not found')

    const otps = await OTP.find({ userId }).sort({createdAt: -1})

    if ( otps.length === 0 ) throw new Error('No OTP generated for user')

    const otp = otps[0]
    const validity = Number(otp.validity);
    
    if ( otp.code !== code.trim().toUpperCase()) throw new Error("Incorrect OTP code");

    if ( otp.expired ) throw new Error('OTP expired')

    await OTP.updateMany({ userId }, { expired: true})

    if (!onTime( otp.createdAt , validity )) throw new Error("OTP expired")

    await Promise.all(
      otps.map(async ( otp ) =>( OTP.findByIdAndDelete( otp._id )))
    )

    return true
  } catch (error) {
    throw new Error( error.message.toLowerCase().includes('otp') ? error.message : 'Could not validate OTP. Try again later')
  }
}