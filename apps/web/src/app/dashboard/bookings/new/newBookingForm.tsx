"use client"

import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import NewBookingStep1 from "./newBookingStep1"
import NewBookingStep2 from "./newBookingStep2"
import NewBookingStep3 from "./newBookingStep3"
import NewBookingStep4 from "./newBookingStep4"
import NewBookingFinal from "./newBookingFinal"
import { useState } from "react"
import {
  NewBookingAgencyLocationType,
  NewBookingFormDataType,
} from "./newBookingCommon"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"

type NewBookingFormProps = {
  agencyId: string
  agencyLocation: NewBookingAgencyLocationType
  vehicles: FindVehiclesByAgencyType
  drivers: FindDriversByAgencyType
  commissionRate: number
  userId: string
}
export default function NewBookingForm(props: NewBookingFormProps) {
  const [newBookingFormData, setNewBookingFormData] =
    useState<NewBookingFormDataType>({
      customerPhone: "",
      existingCustomer: null,
      newCustomerLocationState: props.agencyLocation.state,
      newCustomerLocationCity: props.agencyLocation.city,
      tripStartDate: new Date(),
      tripEndDate: new Date(),
      tripSourceLocationState: props.agencyLocation.state,
      tripSourceLocationCity: props.agencyLocation.city,
      tripDestinationLocationState: props.agencyLocation.state,
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
      agencyId={props.agencyId}
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
      agencyId={props.agencyId}
    />,
  ])

  return (
    <div
      id="newBookingForm"
      className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
    >
      {steps[currentStepIndex]}
    </div>
  )
}
