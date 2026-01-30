"use server"
import { login } from "@/lib/auth"

export async function loginAction(userId: string, password: string) {
  const loginStatus = await login(userId, password)
  return loginStatus
}
