import {
  deleteWebSession,
  createWebSession,
  verifyWebSessionInDB,
  getSessionPayloadFromCookie,
} from "./session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { cache } from "react"
import { redirect, RedirectType } from "next/navigation"

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
  //1. Check user credentials in DB
  const userData = await userServices.checkUserCredentialsInDB(userId, password)
  if (userData.error) {
    return { error: userData.error }
  }

  //Credentials are valid
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
