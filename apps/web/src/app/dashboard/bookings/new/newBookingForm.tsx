/* eslint-disable react-hooks/immutability */
"use client"

import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import NewBookingStep1 from "./newBookingStep1"
import NewBookingStep2 from "./newBookingStep2"
import NewBookingStep3 from "./newBookingStep3"
import NewBookingStep4 from "./newBookingStep4"
import NewBookingFinal from "./newBookingFinal"
import { useState } from "react"
import { NewBookingFormDataType } from "./newBookingCommon"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"

export default function NewBookingForm(props: {
  agency: NonNullable<FindAgencyByIdType>
  vehicles: FindVehiclesByAgencyType
  drivers: FindDriversByAgencyType
  commissionRate: number
  userId: string
  customers: FindCustomersInAgencyType
}) {
  const [newBookingFormData, setNewBookingFormData] =
    useState<NewBookingFormDataType>({
      customerPhone: "",
      existingCustomer: undefined,
      newCustomerLocationState: props.agency.location.state,
      newCustomerLocationCity: props.agency.location.city,
      tripStartDate: new Date(),
      tripEndDate: new Date(),
      tripSourceLocationState: props.agency.location.state,
      tripSourceLocationCity: props.agency.location.city,
      tripDestinationLocationState: props.agency.location.state,
      tripDestinationLocationCity: "",
      tripNeedsAC: true,
      tripPassengers: 1,
      tripType: BookingTypeEnum.OneWay,
      selectedCommissionRate: props.commissionRate,
      selectedDistance: undefined,
      selectedRatePerKm: undefined,
      selectedAllowancePerDay: undefined,
      selectedAcChargePerDay: undefined,
    })

  const nextStepHandler = () => {
    nextStep()
  }

  const prevStepHandler = () => {
    prevStep()
  }

  const { currentStepIndex, steps, nextStep, prevStep } = useMultiStepForm([
    <NewBookingStep1
      key={0}
      onNext={nextStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
      agencyId={props.agency.id}
      customers={props.customers}
    />,
    <NewBookingStep2
      key={1}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
    />,
    <NewBookingStep3
      key={2}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
      vehicles={props.vehicles}
      drivers={props.drivers}
    />,
    <NewBookingStep4
      key={3}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
    />,
    <NewBookingFinal
      key={4}
      onPrev={prevStepHandler}
      newBookingFormData={newBookingFormData}
      userId={props.userId}
      agencyId={props.agency.id}
    />,
  ])

  return (
    <div id="newBookingForm" className="flex flex-col gap-4 w-full h-full">
      {steps[currentStepIndex]}
    </div>
  )
}
