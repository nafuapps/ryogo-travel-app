"server only"

import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
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

export const writePermissions = {
  //Allow only Owner role users
  async allowOwner(agencyId: string) {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      currentUser.userRole !== UserRolesEnum.OWNER ||
      currentUser.agencyId !== agencyId
    ) {
      console.error(`Current User not found or is not owner: ${currentUser}`)
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },

  //Allow users who can use dashboard (Owner, Agent)
  async allowDashboardUser(agencyId: string) {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
        currentUser.userRole,
      ) ||
      currentUser.agencyId !== agencyId
    ) {
      console.error(
        `Current User not found or is not dashboard user: ${currentUser}`,
      )
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },

  //Allow Owner or a user with the specific userId
  async allowAssignedUserOrOwner({
    agencyId,
    assignedUserId,
  }: {
    agencyId: string
    assignedUserId: string
  }) {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      (currentUser.userRole !== UserRolesEnum.OWNER &&
        currentUser.userId !== assignedUserId) ||
      currentUser.agencyId !== agencyId
    ) {
      console.error(
        `Current User not found or is not assigned user or owner: ${currentUser}`,
      )
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },

  //Allow Driver with a specific userId
  async allowAssignedDriver({
    agencyId,
    assignedDriverUserId,
  }: {
    agencyId: string
    assignedDriverUserId?: string | null
  }) {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      currentUser.userRole !== UserRolesEnum.DRIVER ||
      currentUser.userId !== assignedDriverUserId ||
      currentUser.agencyId !== agencyId
    ) {
      console.error(
        `Current User not found or is not assigned driver: ${currentUser}`,
      )
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },

  //Allow all users
  async allowAllUsers(agencyId?: string) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      console.error(`Current User not found`)
      return
    }
    if (agencyId && currentUser.agencyId !== agencyId) {
      console.error(`Agency mismatch: ${currentUser} ${agencyId}`)
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },

  //Allow user with a specific userId
  async allowAssignedUser({
    agencyId,
    assignedUserId,
  }: {
    agencyId: string
    assignedUserId: string
  }) {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      currentUser.agencyId !== agencyId ||
      currentUser.userId !== assignedUserId
    ) {
      console.error(
        `Current User not found or agency/user mismatch: ${currentUser}`,
      )
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },

  //Allow dashboard users (Owner, Agent) or a user with the specific userId
  async allowDashboardUserOrAssignedUser({
    agencyId,
    assignedUserId,
  }: {
    agencyId: string
    assignedUserId: string
  }) {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      (![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
        currentUser.userRole,
      ) &&
        currentUser.userId !== assignedUserId) ||
      currentUser.agencyId !== agencyId
    ) {
      console.error(
        `Current User not found or is not dashboard or assigned user: ${currentUser}`,
      )
      return
    }
    if (!(await verifyCurrentUser())) {
      console.error(`Current User not verified: ${currentUser}`)
      return
    }
    return currentUser
  },
}
