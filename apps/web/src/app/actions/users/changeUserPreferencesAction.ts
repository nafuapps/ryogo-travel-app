"use server"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import {
  LOCALE_COOKIE_NAME,
  DARK_MODE_COOKIE_NAME,
} from "@ryogo-travel-app/api/apiConfig"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserLangEnum } from "@ryogo-travel-app/db/schema"
import { cookies } from "next/headers"

export async function changeUserPreferencesAction({
  userId,
  agencyId,
  prefersDarkTheme,
  languagePref,
}: {
  userId: string
  agencyId: string
  prefersDarkTheme: boolean
  languagePref: UserLangEnum
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userId !== userId ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  const user = await userServices.changeUserPreferences({
    userId,
    prefersDarkTheme,
    languagePref,
  })
  if (!user) return
  const store = await cookies()
  store.set(LOCALE_COOKIE_NAME, languagePref)
  store.set(DARK_MODE_COOKIE_NAME, prefersDarkTheme ? "true" : "false")
  return user
}
