"use server"

import { DARK_MODE_COOKIE_NAME, LOCALE_COOKIE_NAME } from "@/lib/session"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"

export async function changeUserPreferencesAction(
  userId: string,
  data: { prefersDarkTheme: boolean; languagePref: UserLangEnum },
) {
  const user = await userServices.changeUserPreferences(
    userId,
    data.prefersDarkTheme,
    data.languagePref,
  )
  if (!user) return false
  const store = await cookies()
  store.set(LOCALE_COOKIE_NAME, data.languagePref)
  store.set(DARK_MODE_COOKIE_NAME, data.prefersDarkTheme ? "true" : "false")
  return true
}
