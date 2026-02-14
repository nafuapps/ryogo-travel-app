"use server"

import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function changeAgencyEmailAction(agencyId: string, email: string) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  const agency = await agencyServices.changeAgencyEmail(agencyId, email)
  return agency
}
