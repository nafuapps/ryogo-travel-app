"use server"

import { writePermissions } from "@/lib/permissions"
import { routeServices } from "@ryogo-travel-app/api/services/route.services"

export async function findOrCreateRouteAction({
  agencyId,
  sourceCity,
  sourceState,
  destinationCity,
  destinationState,
}: {
  agencyId: string
  sourceCity: string
  sourceState: string
  destinationCity: string
  destinationState: string
}) {
  const currentUser = await writePermissions.allowDashboardUser(agencyId)
  if (!currentUser) return

  const route = await routeServices.findOrCreateRouteByLocations({
    sourceCity,
    sourceState,
    destinationCity,
    destinationState,
  })
  return route
}
