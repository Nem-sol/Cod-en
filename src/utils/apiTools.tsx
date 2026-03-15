import { format } from "date-fns";

export const emails = process.env.NEXT_PUBLIC_EMAIL

export const socketUrl = process.env.NEXT_PUBLIC_socketUrl || 'http://localhost:4000'

export const tels = process.env.NEXT_PUBLIC_tels || '+234 902 2924 447'

export function newDate () {
  return format(new Date(), "do MMMM, yyyy")
}
export function onTime ( focus: string , allowance: number = 0 ) {
  
  // Compute expiration time safely (no timezone issues)
  // createdAt is stored as UTC in MongoDB by default
  const nowUTC = Date.now(); // also UTC
  const forceString = String(focus)
  const createdAtUTC = new Date(forceString).getTime();
  const expiryUTC = createdAtUTC + allowance * 60 * 1000;

  return expiryUTC > nowUTC // return if isOnTime
}