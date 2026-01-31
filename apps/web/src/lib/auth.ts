import {
  deleteWebSession,
  createWebSession,
  decrypt,
  SessionPayload,
  SESSION_COOKIE_NAME,
} from "./session"
import { cookies } from "next/headers"
import {
  LOGIN_SESSION_ERROR,
  LOGIN_UNKNOWN_ERROR,
  userServices,
} from "@ryogo-travel-app/api/services/user.services"

// Get current user from session
export async function getCurrentUser() {
  // S1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return null

  // S2: Decrypt payload from encrypted session
  const payload = (await decrypt(session)) as SessionPayload | undefined
  if (!payload) return null

  // S3: Return payload as current user data
  return payload
}

// Login user - Create session and update login time in DB
export async function login(userId: string, password: string) {
  //1. Try login
  const userData = await userServices.checkLoginInDB(userId, password)
  if (userData.error) {
    return { error: userData.error }
  }

  if (userData.data) {
    //2. create session
    const token = await createWebSession(userData.data)
    if (!token) return { error: LOGIN_SESSION_ERROR }

    //3. Return login success if token created
    return {
      id: userData.data.id,
      userRole: userData.data.userRole,
    }
  }
  return { error: LOGIN_UNKNOWN_ERROR }
}

// Logout user - Delete session and log last logout time in DB
export async function logout() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return null

  const payload = (await decrypt(session)) as SessionPayload | undefined
  if (!payload) return null

  await userServices.checkLogoutInDB(payload.userId)
  await deleteWebSession()
}
export { LOGIN_SESSION_ERROR }
