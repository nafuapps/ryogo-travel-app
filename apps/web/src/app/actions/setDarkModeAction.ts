"use server"

import { DARK_MODE_COOKIE_NAME } from "@ryogo-travel-app/api/apiConfig"
import { cookies } from "next/headers"

export async function setDarkModeAction(isDark: boolean) {
  const cookieStore = await cookies()
  cookieStore.set(DARK_MODE_COOKIE_NAME, isDark ? "true" : "false", {
    maxAge: 315360000, // 10 years
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })
}
