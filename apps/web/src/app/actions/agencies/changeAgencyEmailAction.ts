"use server"

import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export async function changeAgencyEmailAction(agencyId: string, email: string) {
  const agency = await agencyServices.changeAgencyEmail(agencyId, email)

  if (!agency) return false
  return true
}
