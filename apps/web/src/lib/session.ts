import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { sessionServices } from "@ryogo-travel-app/api/services/sessionServices";

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  sessionId: string;
  userId: string;
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

//Create session both in cookie and database
export async function createWebSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 1. Create a session in the database
  const sessionData = await sessionServices.createSession({
    userId,
    expiresAt,
  });

  // 2. Encrypt the session ID
  const session = await encrypt({
    sessionId: sessionData[0].id,
    userId: sessionData[0].userId,
    expiresAt,
  });

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

//Update session expiry both in cookie and database
export async function updateWebSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = (await decrypt(session)) as SessionPayload | undefined;

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  //Update session expiry in database
  await sessionServices.updateSessionExpiringTime(payload.sessionId, expires);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

//Delete session both from cookie and database
export async function deleteWebSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = (await decrypt(session)) as SessionPayload | undefined;

  if (!session || !payload) {
    return null;
  }

  sessionServices.deleteSession(payload.sessionId);

  const cookieStore = await cookies();
  cookieStore.delete("session");
}
