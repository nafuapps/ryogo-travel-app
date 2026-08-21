/* eslint-disable react-hooks/immutability */
"use client"

import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import NewBookingStepTripDetails from "./newBookingStepTripDetails"
import NewBookingStepVehicle from "./newBookingStepVehicle"
import NewBookingStepDriver from "./newBookingStepDriver"
import NewBookingStepPrice from "./newBookingStepPrice"
import NewBookingFinal from "./newBookingFinal"
import { useState } from "react"
import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import {
  NEW_BOOKING_DEFAULT_DISTANCE,
  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
  NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY,
  NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
} from "@/lib/uiConfig"

export default function NewBookingForm(props: {
  agency: NonNullable<FindAgencyByIdType>
  drivers: FindDriversByAgencyType
  userId: string
  customerId: string
  vehicles: FindVehiclesByAgencyType
  limited: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const [newBookingFormData, setNewBookingFormData] =
    useState<NewBookingRequestDataType>({
      tripStartDate: new Date(),
      tripEndDate: new Date(),
      tripSourceLocationState: props.agency.location.state,
      tripSourceLocationCity: props.agency.location.city,
      tripDestinationLocationState: props.agency.location.state,
      tripDestinationLocationCity: "",
      tripNeedsAC: true,
      tripPassengers: 1,
      tripType: BookingTypeEnum.OneWay,
      selectedCommissionRate: props.agency.defaultCommissionRate,
      selectedDistance: NEW_BOOKING_DEFAULT_DISTANCE,
      selectedRatePerKm: NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
      selectedAllowancePerDay: NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY,
      selectedAcChargePerDay: NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
    })

  const nextStepHandler = () => {
    nextStep()
  }

  const prevStepHandler = () => {
    prevStep()
  }

  const { currentStepIndex, steps, nextStep, prevStep } = useMultiStepForm([
    <NewBookingStepTripDetails
      key={0}
      onNext={nextStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
    />,
    <NewBookingStepVehicle
      key={1}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
      vehicles={props.vehicles}
      limited={props.limited}
      isSubscribed={props.isSubscribed}
      hasTriedSubscription={props.hasTriedSubscription}
    />,
    <NewBookingStepDriver
      key={2}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newBookingFormData={newBookingFormData}
      setNewBookingFormData={setNewBookingFormData}
      drivers={props.drivers}
      limited={props.limited}
      isSubscribed={props.isSubscribed}
      hasTriedSubscription={props.hasTriedSubscription}
    />,
    <NewBookingStepPrice
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
      customerId={props.customerId}
      userId={props.userId}
      agencyId={props.agency.id}
    />,
  ])

  return steps[currentStepIndex]
}
