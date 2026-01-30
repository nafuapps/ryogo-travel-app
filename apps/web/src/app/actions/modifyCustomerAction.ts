"use server"

import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { SelectCustomerType } from "@ryogo-travel-app/db/schema"

export async function modifyCustomerAction(
  id: string,
  data: {
    name?: string
    email?: string
    address?: string
    remarks?: string
    state: string
    city: string
  },
) {
  const customer: SelectCustomerType[] = await customerServices.modifyCustomer(
    id,
    data.state,
    data.city,
    data.name,
    data.email,
    data.address,
    data.remarks,
  )
  return customer[0]
}
