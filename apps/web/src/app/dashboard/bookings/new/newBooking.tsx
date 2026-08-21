"use client"

import { useState } from "react"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import NewBookingAddCustomerPageComponent from "./newBookingAddCustomer"
import NewBookingSearchCustomerPageComponent from "./newBookingSearchCustomer"

export default function NewBookingPageComponent(props: {
  agency: NonNullable<FindAgencyByIdType>
  customers: FindCustomersInAgencyType
  userId: string
}) {
  const [addingCustomer, setAddingCustomer] = useState(false)

  if (addingCustomer) {
    return (
      <NewBookingAddCustomerPageComponent
        userId={props.userId}
        agency={props.agency}
        customers={props.customers}
        setAddingCustomer={setAddingCustomer}
      />
    )
  }

  return (
    <NewBookingSearchCustomerPageComponent
      customers={props.customers}
      onClick={() => setAddingCustomer(true)}
    />
  )
}
