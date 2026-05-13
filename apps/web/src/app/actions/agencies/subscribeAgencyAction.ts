"use server"

import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { revalidatePath } from "next/cache"

export async function subscribeAgencyAction(id: string, days: number) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== id
  ) {
    return
  }

  const agency = await agencyServices.subscribeAgency(id, days)
  if (!agency) return

  revalidatePath("/dashboard")

  return agency
}
