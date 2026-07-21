"use server"

import { LOCALE_COOKIE_NAME } from "@ryogo-travel-app/api/apiConfig"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { refresh } from "next/cache"
import { cookies } from "next/headers"

export async function setLocaleAction(locale: UserLangEnum) {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: 315360000, // 10 years
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })
  refresh()
}
