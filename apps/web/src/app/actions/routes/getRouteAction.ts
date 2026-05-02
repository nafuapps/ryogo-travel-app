"use server"

import { getCurrentUser } from "@/lib/auth"
import { routeServices } from "@ryogo-travel-app/api/services/route.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function getRouteAction(
  sourceCity: string,
  sourceState: string,
  destinationCity: string,
  destinationState: string,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(currentUser.userRole)
  ) {
    return
  }

  const route = await routeServices.findOrCreateRouteByLocations(
    sourceCity,
    sourceState,
    destinationCity,
    destinationState,
  )
  return route
}
