"use server"

import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export async function changeAgencyPhoneAction(agencyId: string, email: string) {
  const agency = await agencyServices.changeAgencyPhone(agencyId, email)

  if (!agency) return false
  return true
}
