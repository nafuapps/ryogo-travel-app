import {
  deleteWebSession,
  createWebSession,
  decrypt,
  SessionPayloadType,
  checkWebSessionInDB,
} from "./session"
import { cookies } from "next/headers"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { cache } from "react"
import { SESSION_COOKIE_NAME } from "@ryogo-travel-app/api/apiConfig"
import { redirect, RedirectType } from "next/navigation"

//Get current user session from cookie - for optimistic checks before DB reads
export const getCurrentUser = cache(async () => {
  // S1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return

  // S2: Decrypt payload from encrypted session
  const payload = (await decrypt(session)) as SessionPayloadType | undefined
  if (!payload) return

  // S3: Return payload as current user data
  return payload
})

//Verify User session in DB - For strict checking before any DB writes
export const verifyCurrentUser = cache(async () => {
  const payload = await getCurrentUser()
  if (!payload) return

  return await checkWebSessionInDB(payload.token, payload.userId)
})

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
    if (!token) return { error: "sessionNotCreated" }

    //3. Return login success if token created
    return {
      id: userData.data.id,
      userRole: userData.data.userRole,
    }
  }
  return { error: "unknown" }
}

// Logout user - Delete session and log last logout time in DB
export async function logout() {
  await deleteWebSession()
  redirect("/auth/login", RedirectType.replace)
}
