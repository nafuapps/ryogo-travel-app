import {
  deleteWebSession,
  createWebSession,
  decrypt,
  SessionPayload,
} from "./session";
import { cookies } from "next/headers";
import { sessionServices } from "@ryogo-travel-app/api/services/sessionServices";
import { userServices } from "@ryogo-travel-app/api/services/userServices";

// Get current user from session
export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const payload = (await decrypt(session)) as SessionPayload | undefined;
  if (!payload) return null;

  //Get the user whose id matches the session's userId
  const sessionRecord = await sessionServices.getSessionById(payload.sessionId);

  return sessionRecord[0] || null;
}

// Login user - Create session and log login time in DB
export async function login(phone: string, password: string) {
  //1. check if login credentials match
  const userData = await userServices.checkLoginCredentialsInDB(
    phone,
    password
  );

  //2. create session
  createWebSession(userData[0]!.id);
}

// Logout user - Delete session and log last logout time in DB
export async function logout() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const payload = (await decrypt(session)) as SessionPayload | undefined;
  if (!payload) return null;

  await userServices.logUserLastLogout(payload.userId);
  await deleteWebSession();
}
