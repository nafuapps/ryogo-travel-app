import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { sessionRepository } from "@ryogo-travel-app/api/repositories/session.repo";
import { SelectUserType } from "@ryogo-travel-app/db/schema";

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE_NAME = "session";
export const LOCALE_COOKIE_NAME = "locale";
export const SESSION_COOKIE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

export type SessionPayload = {
  sessionId: string;
  userId: string;
  token: string;
  agencyId: string;
  userRole: string;
  isAdmin: boolean;
  status: string;
  expiresAt: Date;
};

//Encrypt session data into a JWT
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

//Decrypt session JWT to get session data
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error, "Failed to verify session");
  }
}

//Get session from DB
export async function getWebSession() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const payload = (await decrypt(session)) as SessionPayload | undefined;

  const token = payload?.token;
  const sessionDB = await sessionRepository.getSessionByToken(token!);

  if (
    !sessionDB ||
    sessionDB.length === 0 ||
    sessionDB[0]!.expiresAt < new Date()
  ) {
    return null;
  }
  return sessionDB[0];
}

//Create session both in cookie and database
export async function createWebSession(user: SelectUserType) {
  const expiresAt = new Date(Date.now() + SESSION_COOKIE_EXPIRATION);
  // const token = randomBytes(32).toString("hex");
  const token = crypto.randomUUID();

  // 1. Create a session in the database
  const sessionData = await sessionRepository.createSession({
    userId: user.id,
    token,
    expiresAt,
  });

  // 2. Encrypt the session data
  const session = await encrypt({
    sessionId: sessionData[0]!.id,
    token: sessionData[0]!.token,
    userId: sessionData[0]!.userId,
    agencyId: user.agencyId,
    isAdmin: user.isAdmin ?? false,
    userRole: user.userRole.toString().toLowerCase(),
    status: user.status.toString().toLowerCase(),
    expiresAt,
  });

  // 3. Store the session data in cookies for optimistic auth checks
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  //4. Also set locale cookie
  cookieStore.set(LOCALE_COOKIE_NAME, user.languagePref, {
    maxAge: 31536000, // 1 year
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  return token;
}

//Update session expiry both in cookie and database
export async function updateWebSession() {
  // 1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const payload = (await decrypt(session)) as SessionPayload | undefined;

  if (!session || !payload) {
    return null;
  }

  // 2. New expiry
  const expires = new Date(Date.now() + SESSION_COOKIE_EXPIRATION);

  // 3. Update session expiry in database
  await sessionRepository.updateSessionExpiringTime(payload.sessionId, expires);

  // 4. Update session expiry in cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

//Delete session both from cookie and database
export async function deleteWebSession() {
  // 1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const payload = (await decrypt(session)) as SessionPayload | undefined;

  if (!session || !payload) {
    return null;
  }

  // 2. Delete session from database
  sessionRepository.deleteSession(payload.sessionId);

  // 3. Delete session from cookie
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
