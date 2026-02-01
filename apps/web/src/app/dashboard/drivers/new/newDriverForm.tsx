/* eslint-disable react-hooks/immutability */
"use client"

import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useState } from "react"
import { NewDriverStep1 } from "./newDriverStep1"
import { NewDriverStep2 } from "./newDriverStep2"
import { NewDriverStep3 } from "./newDriverStep3"
import { NewDriverConfirm } from "./newDriverConfirm"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

type NewDriverFormProps = {
  agencyId: string
  allDrivers: FindAllUsersByRoleType
}
export default function NewDriverForm(props: NewDriverFormProps) {
  const [newDriverFormData, setNewDriverFormData] =
    useState<AddDriverRequestType>({
      agencyId: props.agencyId,
      data: {
        name: "",
        phone: "",
        email: "",
        userPhotos: undefined,
        licenseNumber: "",
        licenseExpiresOn: undefined,
        licensePhotos: undefined,
        address: "",
        canDriveVehicleTypes: [],
        defaultAllowancePerDay: undefined,
      },
    })

  const nextStepHandler = () => {
    nextStep()
  }

  const prevStepHandler = () => {
    prevStep()
  }

  const { currentStepIndex, steps, nextStep, prevStep } = useMultiStepForm([
    <NewDriverStep1
      key={0}
      onNext={nextStepHandler}
      newDriverFormData={newDriverFormData}
      setNewDriverFormData={setNewDriverFormData}
      agencyId={props.agencyId}
      allDrivers={props.allDrivers}
    />,
    <NewDriverStep2
      key={1}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newDriverFormData={newDriverFormData}
      setNewDriverFormData={setNewDriverFormData}
    />,
    <NewDriverStep3
      key={2}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newDriverFormData={newDriverFormData}
      setNewDriverFormData={setNewDriverFormData}
    />,
    <NewDriverConfirm
      key={3}
      onNext={nextStepHandler}
      onPrev={prevStepHandler}
      newDriverFormData={newDriverFormData}
      agencyId={props.agencyId}
    />,
  ])

  return (
    <div
      id="newDriverForm"
      className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
    >
      {steps[currentStepIndex]}
    </div>
  )
}
