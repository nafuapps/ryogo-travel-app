import {
  deleteWebSession,
  createWebSession,
  decrypt,
  SessionPayload,
  SESSION_COOKIE_NAME,
} from "./session";
import { cookies } from "next/headers";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { redirect, RedirectType } from "next/navigation";

// Get current user from session
export async function getCurrentUser() {
  // S1. Get session from cookie
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  // S2: Decrypt payload from encrypted session
  const payload = (await decrypt(session)) as SessionPayload | undefined;
  if (!payload) return null;

  // S3: Return payload as current user data
  return payload;
}

// Login user - Create session and update login time in DB
export async function login(userId: string, password: string) {
  try {
    //1. Try login
    const userData = await userServices.checkLoginInDB(userId, password);
    if (userData == null) {
      return null;
    }
    if (userData.length < 1) {
      return {};
    }
    //2. create session
    const token = await createWebSession(userData[0]!);
    if (!token) return null;

    //3. Return login success if token created
    return {
      id: userData[0]!.id,
      userRole: userData[0]!.userRole.toString().toLowerCase(),
    };
  } catch (error) {
    console.log(error);
    //No user found with this id.. redirect to login page
    redirect("/auth/login", RedirectType.replace);
  }
}

// Logout user - Delete session and log last logout time in DB
export async function logout() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  const payload = (await decrypt(session)) as SessionPayload | undefined;
  if (!payload) return null;

  await userServices.checkLogoutInDB(payload.userId);
  await deleteWebSession();
}
