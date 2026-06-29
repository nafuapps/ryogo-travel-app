"use server"

import { LOCALE_COOKIE_NAME } from "@/lib/session"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"

export async function setLocaleAction(locale: UserLangEnum) {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: 315360000, // 10 years
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })
}
