"use server"

import { getCurrentUser } from "@/lib/auth"
import {
  LOCALE_COOKIE_NAME,
  DARK_MODE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"

export async function changeUserPreferencesAction(
  userId: string,
  agencyId: string,
  data: { prefersDarkTheme: boolean; languagePref: UserLangEnum },
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const user = await userServices.changeUserPreferences(
    userId,
    data.prefersDarkTheme,
    data.languagePref,
  )
  if (!user) return
  const store = await cookies()
  store.set(LOCALE_COOKIE_NAME, data.languagePref)
  store.set(DARK_MODE_COOKIE_NAME, data.prefersDarkTheme ? "true" : "false")
  return user
}
