"use client"

import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useState } from "react"
import { NewVehicleStep1 } from "./newVehicleStep1"
import { NewVehicleStep2 } from "./newVehicleStep2"
import { NewVehicleStep3 } from "./newVehicleStep3"
import { NewVehicleStep4 } from "./newVehicleStep4"
import { NewVehicleConfirm } from "./newVehicleConfirm"

export type NewVehicleFormDataType = {
  vehicleNumber: string
  type: string
  brand: string
  color: string
  model: string
  capacity: number | undefined
  odometerReading: number | undefined
  rcPhotos: FileList | undefined
  vehiclePhotos: FileList | undefined
  insuranceExpiresOn: Date | undefined
  pucExpiresOn: Date | undefined
  rcExpiresOn: Date | undefined
  insurancePhotos: FileList | undefined
  pucPhotos: FileList | undefined
  hasAC: boolean
  defaultRatePerKm: number | undefined
  defaultAcChargePerDay: number | undefined
}

type NewVehicleFormProps = {
  agencyId: string
  existingVehicles: string[]
}
export default function NewVehicleForm(props: NewVehicleFormProps) {
  const [newVehicleFormData, setNewVehicleFormData] =
    useState<NewVehicleFormDataType>({
      vehicleNumber: "",
      type: "",
      brand: "",
      color: "",
      model: "",
      capacity: undefined,
      odometerReading: undefined,
      rcPhotos: undefined,
      vehiclePhotos: undefined,
      insuranceExpiresOn: undefined,
      pucExpiresOn: undefined,
      rcExpiresOn: undefined,
      insurancePhotos: undefined,
      pucPhotos: undefined,
      hasAC: true,
      defaultRatePerKm: undefined,
      defaultAcChargePerDay: undefined,
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
