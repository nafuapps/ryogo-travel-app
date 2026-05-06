import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { sessionRepository } from "@ryogo-travel-app/api/repositories/session.repo"
import {
  SelectUserType,
  UserRolesEnum,
  UserStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { userServices } from "@ryogo-travel-app/api/services/user.services"

const secretKey = process.env.AUTH_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export const SESSION_COOKIE_NAME = "session"
export const LOCALE_COOKIE_NAME = "locale"
export const DARK_MODE_COOKIE_NAME = "dark"
export const SESSION_COOKIE_EXPIRATION = 7 * 24 * 60 * 60 * 1000

// Don't add any sensitive data like email, password in this payload
export type SessionPayload = {
  sessionId: string
  userId: string
  token: string
  agencyId: string
  userRole: UserRolesEnum
  phone: string
  isAdmin: boolean
  isVerified: boolean
  status: UserStatusEnum
  expiresAt: Date
}

//Encrypt session data into a JWT
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

//Decrypt session JWT to get session data
export async function decrypt(session: string = "") {
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  })
  return payload
}

//Get session from DB by token
export async function getWebSession() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return

  const payload = (await decrypt(session)) as SessionPayload | undefined
  if (!payload) return

  const token = payload.token
  const sessionDB = await sessionRepository.readSessionByToken(token)

  if (!sessionDB[0] || sessionDB[0].expiresAt < new Date()) {
    return
  }
  return sessionDB[0]
}

//Create session both in cookie and database
export async function createWebSession(user: SelectUserType) {
  const expiresAt = new Date(Date.now() + SESSION_COOKIE_EXPIRATION)
  const token = crypto.randomUUID()

  // 1. Create a session in the database
  const sessionData = await sessionRepository.createSession({
    userId: user.id,
    token,
    expiresAt,
  })

  if (!sessionData[0]) return

  // 2. Encrypt the session data
  const newPayload: SessionPayload = {
    sessionId: sessionData[0].id,
    token: sessionData[0].token,
    userId: sessionData[0].userId,
    agencyId: user.agencyId,
    isAdmin: user.isAdmin ?? false,
    isVerified: user.isVerified ?? false,
    userRole: user.userRole,
    phone: user.phone,
    status: user.status,
    expiresAt,
  }
  const session = await encrypt(newPayload)

  // 3. Store the session data in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
  })

  //4. Also set locale cookie
  cookieStore.set(LOCALE_COOKIE_NAME, user.languagePref, {
    maxAge: 315360000, // 10 years
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })

  //5. Also set dark mode cookie
  cookieStore.set(
    DARK_MODE_COOKIE_NAME,
    user.prefersDarkTheme ? "true" : "false",
    {
      maxAge: 315360000, // 10 years
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  )

  return token
}

//Update session expiry both in cookie and database
export async function updateWebSession() {
  // 1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return

  const payload = (await decrypt(session)) as SessionPayload | undefined
  if (!payload) return

  // 2. New expiry
  const expires = new Date(Date.now() + SESSION_COOKIE_EXPIRATION)

  // 3. Update session expiry in database
  await sessionRepository.updateSessionExpiringTime(payload.sessionId, expires)

  // 4. Update session expiry in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
  })
}

//Update user status in session
export async function updateSessionUserStatus(newStatus: UserStatusEnum) {
  // 1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const payload = (await decrypt(session)) as SessionPayload | undefined

  if (!session || !payload) {
    return
  }

  // 2. Update user status in payload
  const newSession = await encrypt({
    ...payload,
    status: newStatus,
  })

  // 4. Update session expiry in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + SESSION_COOKIE_EXPIRATION),
    sameSite: "lax",
  })
}

//Update user verification status in session
export async function updateVerificationStatus(isVerified: boolean) {
  // 1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const payload = (await decrypt(session)) as SessionPayload | undefined

  if (!session || !payload) {
    return
  }

  // 2. Update verification status in payload
  const newSession = await encrypt({
    ...payload,
    isVerified: isVerified,
  })

  // 4. Update session expiry in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + SESSION_COOKIE_EXPIRATION),
    sameSite: "lax",
  })
}

//Delete session both from db and cookie
export async function deleteWebSession() {
  // 1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return

  const payload = (await decrypt(session)) as SessionPayload | undefined
  if (!payload) return

  // 2. Delete session from database
  await userServices.logOutInDB(payload.userId, payload.sessionId)

  // 3. Delete session from cookie
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
