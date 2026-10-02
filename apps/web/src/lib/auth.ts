import {
  deleteWebSession,
  createWebSession,
  verifyWebSessionInDB,
  getSessionPayloadFromCookie,
} from "./session"
import { cache } from "react"

//Get current user session from cookie - for optimistic checks before DB reads
export const getCurrentUser = cache(async () => {
  return await getSessionPayloadFromCookie()
})

//Verify User session in DB - For strict checking before any DB writes
export const verifyCurrentUser = cache(async () => {
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  return await verifyWebSessionInDB(payload.token, payload.userId)
})

// Login user - Create session and update login time in DB
export async function login(userId: string, password: string) {
  const user = await createWebSession(userId, password)
  return user
}

// Logout user - Delete session and log last logout time in DB
export async function logout() {
  const result = await deleteWebSession()
  return result
}
