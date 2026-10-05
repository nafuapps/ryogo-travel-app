import { cookies, headers } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
  SESSION_COOKIE_EXPIRATION_DAYS,
  SESSION_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { addDays } from "date-fns"

const secretKey = process.env.AUTH_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// Don't add any sensitive data like email, password in this payload
export type SessionPayloadType = {
  sessionId: string
  userId: string
  token: string
  agencyId: string
  userRole: UserRolesEnum
  name: string
  phone: string
  isAdmin: boolean
  isVerified: boolean
  status: UserStatusEnum
  updatedAt: Date
  expiresAt: Date
  locatedAt: Date | null
}

//Encrypt session data into a JWT
async function encrypt(payload: SessionPayloadType) {
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
export async function verifyWebSessionInDB(token: string, userId: string) {
  const sessionDB = await userServices.getUserSessionByToken(token)

  //Check if session exists in DB, is not expired and is of the same user
  if (
    !sessionDB ||
    sessionDB.expiresAt < new Date() ||
    sessionDB.userId !== userId
  ) {
    return
  }

  //Check if current user exists in DB and is not suspended
  const user = await userServices.findUserDetailsById(userId)
  if (!user || user.status === UserStatusEnum.SUSPENDED) return

  return sessionDB
}

//Create session both in cookie and database
export async function createWebSession(userId: string, password: string) {
  //1. Check user credentials in DB
  const user = await userServices.checkUserCredentialsInDB(userId, password)
  const userData = user.data
  if (!userData || user.error) {
    return user
  }

  const expiresAt = createNewExpiryDate()
  const token = crypto.randomUUID()

  const headerList = await headers()

  const ipAddress = headerList.get("x-forwarded-for")
  const userAgent = headerList.get("user-agent")

  // 1. Create a session in the database
  const [sessionData] = await userServices.addUserSession({
    userId: userData.id,
    token,
    expiresAt,
    ipAddress,
    userAgent,
  })

  if (!sessionData) {
    return { error: "sessionNotCreated" }
  }

  // 2. Encrypt the session data
  const newPayload: SessionPayloadType = {
    sessionId: sessionData.id,
    token: sessionData.token,
    userId: sessionData.userId,
    agencyId: userData.agencyId,
    isAdmin: userData.isAdmin,
    isVerified: userData.isVerified,
    userRole: userData.userRole,
    name: userData.name,
    phone: userData.phone,
    status: userData.status,
    locatedAt: userData.locatedAt,
    updatedAt: new Date(),
    expiresAt,
  }
  const encryptedSession = await encrypt(newPayload)

  // 3. Store the session data in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
  })

  //4. Also set locale cookie
  cookieStore.set(LOCALE_COOKIE_NAME, userData.languagePref, {
    maxAge: 315360000, // 10 years
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })

  //5. Also set dark mode cookie
  cookieStore.set(
    DARK_MODE_COOKIE_NAME,
    userData.prefersDarkTheme ? "true" : "false",
    {
      maxAge: 315360000, // 10 years
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  )

  return user
}

//Update session from DB
export async function refreshWebSessionFromDB(payload: SessionPayloadType) {
  const user = await userServices.changeUserLastSeen(payload.userId)
  if (!user) return

  const updatedPayload: SessionPayloadType = {
    sessionId: payload.sessionId,
    userId: payload.userId,
    token: payload.token,
    expiresAt: payload.expiresAt,
    agencyId: user.agencyId,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    userRole: user.userRole,
    name: user.name,
    phone: user.phone,
    status: user.status,
    locatedAt: user.locatedAt,
    updatedAt: user.lastSeen ?? new Date(), //Updated now
  }
  return await encrypt(updatedPayload)
}

//Update user status in session
export async function updateUserStatusInWebSession(newStatus: UserStatusEnum) {
  // 1. Get session payload from cookie
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  // 2. Update user status in payload
  const newSession = await encrypt({
    ...payload,
    status: newStatus,
  })

  // 3. Update New expiry in DB
  const newExpiresAt = await updateSessionExpiryInDB(payload.sessionId)

  // 4. Update session expiry in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: newExpiresAt,
    sameSite: "lax",
  })
}

//Update user verification status in session
export async function updateUserVerificationInWebSession(isVerified: boolean) {
  // 1. Get session payload from cookie
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  // 2. Update verification status in payload
  const newSession = await encrypt({
    ...payload,
    isVerified: isVerified,
  })

  // 3. Update New expiry in DB
  const newExpiresAt = await updateSessionExpiryInDB(payload.sessionId)

  // 4. Update session expiry in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: newExpiresAt,
    sameSite: "lax",
  })
}

//Update user admin status in session
export async function updateUserAdminInWebSession(isAdmin: boolean) {
  // 1. Get session payload from cookie
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  // 2. Update verification status in payload
  const newSession = await encrypt({
    ...payload,
    isAdmin: isAdmin,
  })

  // 3. Update New expiry in DB
  const newExpiresAt = await updateSessionExpiryInDB(payload.sessionId)

  // 4. Update session expiry in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: newExpiresAt,
    sameSite: "lax",
  })
}

//Update user name in session
export async function updateUserNameInWebSession(name: string) {
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  const newSession = await encrypt({
    ...payload,
    name: name,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: payload.expiresAt,
    sameSite: "lax",
  })
}

//Update user locatedAt timestamp in session
export async function updateUserLocatedAtInWebSession(locatedAt: Date) {
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  const newSession = await encrypt({
    ...payload,
    locatedAt: locatedAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: payload.expiresAt,
    sameSite: "lax",
  })
}

//Delete session both from db and cookie
export async function deleteWebSession() {
  // 1. Get session payload from cookie
  const payload = await getSessionPayloadFromCookie()
  if (!payload) return

  // 2. Delete session from database
  const user = await userServices.logOutInDB(payload.userId, payload.sessionId)

  if (!user) return

  // 3. Delete session from cookie
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)

  return user
}

async function updateSessionExpiryInDB(sessionId: string) {
  const expiresAt = createNewExpiryDate()
  await userServices.changeUserSessionExpiry({ sessionId, expiresAt })
  return expiresAt
}

//Expiry date is X days from now
function createNewExpiryDate() {
  return addDays(new Date(), SESSION_COOKIE_EXPIRATION_DAYS)
}

export async function getSessionPayloadFromCookie() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!session) return
  const payload = (await decrypt(session)) as SessionPayloadType | undefined
  if (!payload) return
  return payload
}
