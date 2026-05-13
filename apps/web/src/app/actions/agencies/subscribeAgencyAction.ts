"use server"

import { getCurrentUser } from "@/lib/auth"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { OrderTypeEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { revalidatePath } from "next/cache"

export async function subscribeAgencyAction(
  agencyId: string,
  orderType: OrderTypeEnum,
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    currentUser.userRole !== UserRolesEnum.OWNER ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  const agency = await agencyServices.subscribeAgency(agencyId, orderType)
  if (!agency) return

  revalidatePath("/dashboard")

  return agency
}
