"use server"

import { customerServices } from "@ryogo-travel-app/api/services/customer.services"

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
