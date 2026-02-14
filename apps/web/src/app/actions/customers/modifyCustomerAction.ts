"use server"

import { getCurrentUser } from "@/lib/auth"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export async function modifyCustomerAction(
  id: string,
  agencyId: string,
  data: {
    name?: string
    email?: string
    address?: string
    remarks?: string
    state: string
    city: string
  },
) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    ![UserRolesEnum.OWNER, UserRolesEnum.AGENT].includes(
      currentUser.userRole,
    ) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }
  const customer = await customerServices.modifyCustomer(
    id,
    data.state,
    data.city,
    data.name,
    data.email,
    data.address,
    data.remarks,
  )
  return customer
}
