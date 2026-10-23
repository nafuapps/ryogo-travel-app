"server only"

import { getCurrentUser } from "@/lib/auth"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"

export const readPermissions = {
  //If already authenticated, redirect to corresponding home page
  async redirectIfAuthenticated() {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      if (currentUser.userRole === UserRolesEnum.DRIVER) {
        redirect("/rider/home", RedirectType.replace)
      }
      redirect("/dashboard/home", RedirectType.replace)
    }
  },

  //Get current user. Redirect if not authenticated
  async getAuthenticatedUser() {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      redirect("/auth/login", RedirectType.replace)
    }
    return currentUser
  },
}

export const writePermissions = {}
