"use server"

import { writePermissions } from "@/lib/permissions"
import {
  DARK_MODE_COOKIE_NAME,
  LOCALE_COOKIE_NAME,
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
  const currentUser = await writePermissions.allowAssignedUser({
    agencyId,
    assignedUserId: userId,
  })
  if (!currentUser) return

  const updatedUser = await userServices.changeUserPreferences({
    userId,
    prefersDarkTheme,
    languagePref,
  })
  if (!updatedUser) return

  const store = await cookies()
  store.set(LOCALE_COOKIE_NAME, languagePref)
  store.set(DARK_MODE_COOKIE_NAME, prefersDarkTheme ? "true" : "false")

  return updatedUser
}
