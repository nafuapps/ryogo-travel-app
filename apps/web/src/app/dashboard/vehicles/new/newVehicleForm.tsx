/* eslint-disable react-hooks/immutability */
"use client"

import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useState } from "react"
import { NewVehicleStep1 } from "./newVehicleStep1"
import { NewVehicleStep2 } from "./newVehicleStep2"
import { NewVehicleStep3 } from "./newVehicleStep3"
import { NewVehicleStep4 } from "./newVehicleStep4"
import { NewVehicleConfirm } from "./newVehicleConfirm"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { FindExistingVehiclesInAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"

type NewVehicleFormProps = {
  agencyId: string
  existingVehicles: FindExistingVehiclesInAgencyType
}
export default function NewVehicleForm(props: NewVehicleFormProps) {
  const [newVehicleFormData, setNewVehicleFormData] =
    useState<AddVehicleRequestType>({
      agencyId: props.agencyId,
      data: {
        vehicleNumber: "",
        type: VehicleTypesEnum.CAR,
        brand: "",
        color: "",
        model: "",
        capacity: undefined,
        odometerReading: undefined,
        insuranceExpiresOn: undefined,
        pucExpiresOn: undefined,
        rcExpiresOn: undefined,
        hasAC: true,
        defaultRatePerKm: undefined,
        defaultAcChargePerDay: undefined,
        rcPhotos: undefined,
        vehiclePhotos: undefined,
        insurancePhotos: undefined,
        pucPhotos: undefined,
      },
    })

  const nextStepHandler = () => {
    nextStep()
  }

  const prevStepHandler = () => {
    prevStep()
  }

  const { currentStepIndex, steps, nextStep, prevStep } = useMultiStepForm([
    <NewVehicleStep1
      key={0}
      onNext={nextStepHandler}
      newVehicleFormData={newVehicleFormData}
      setNewVehicleFormData={setNewVehicleFormData}
      agencyId={props.agencyId}
      existingVehicles={props.existingVehicles}
    />,
    <NewVehicleStep2
      key={1}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newVehicleFormData={newVehicleFormData}
      setNewVehicleFormData={setNewVehicleFormData}
    />,
    <NewVehicleStep3
      key={2}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newVehicleFormData={newVehicleFormData}
      setNewVehicleFormData={setNewVehicleFormData}
    />,
    <NewVehicleStep4
      key={3}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newVehicleFormData={newVehicleFormData}
      setNewVehicleFormData={setNewVehicleFormData}
    />,
    <NewVehicleConfirm
      key={4}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newVehicleFormData={newVehicleFormData}
      agencyId={props.agencyId}
    />,
  ])

  return (
    <div
      id="newVehicleForm"
      className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
    >
      {steps[currentStepIndex]}
    </div>
  )
}
