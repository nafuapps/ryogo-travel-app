"use client"

import { useState } from "react"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import NewBookingAddCustomerPageComponent from "./newBookingAddCustomer"
import NewBookingSearchCustomerPageComponent from "./newBookingSearchCustomer"

export default function NewBookingPageComponent({
  agency,
  customers,
  userId,
}: {
  agency: NonNullable<FindAgencyByIdType>
  customers: FindCustomersInAgencyType
  userId: string
}) {
  const [addingCustomer, setAddingCustomer] = useState(false)

  if (addingCustomer) {
    return (
      <NewBookingAddCustomerPageComponent
        userId={userId}
        agency={agency}
        customers={customers}
        setAddingCustomer={setAddingCustomer}
      />
    )
  }

  return (
    <NewBookingSearchCustomerPageComponent
      customers={customers}
      onClick={() => setAddingCustomer(true)}
    />
  )
}
