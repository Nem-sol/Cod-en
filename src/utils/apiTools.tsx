export const emails = process.env.EMAIL_USER || 'codendevs@gmail.com'

export const socketUrl = process.env.socketUrl || 'http://localhost:4000'

export const tels = process.env.tels || '+2349022924447'

export function onTime ( focus: string , allowance: number = 0 ) {
  
  // Compute expiration time safely (no timezone issues)
  // createdAt is stored as UTC in MongoDB by default
  const nowUTC = Date.now(); // also UTC
  const forceString = String(focus)
  const createdAtUTC = new Date(forceString).getTime();
  const expiryUTC = createdAtUTC + allowance * 60 * 1000;

  return expiryUTC > nowUTC // return if isOnTime
}