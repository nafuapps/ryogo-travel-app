/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useState } from "react"
import {
  AddVehicleTotalSteps,
  OnboardingStepHeader,
  OnboardingStepPage,
} from "@/components/flows/onboarding/onboardingSteps"
import { AddVehicleStep1 } from "./addVehicleStep1"
import { AddVehicleFinish } from "./addVehicleFinish"
import { AddVehicleStep2 } from "./addVehicleStep2"
import { AddVehicleStep3 } from "./addVehicleStep3"
import { AddVehicleStep4 } from "./addVehicleStep4"
import { AddVehicleConfirm } from "./addVehicleStep5"
import {
  VehicleBrandEnum,
  VehicleColorEnum,
  VehicleTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"

export default function AddVehiclePageComponent(props: {
  agencyId: string
  status: string
}) {
  const t = useTranslations("Onboarding.AddVehiclePage")
  const [finalData, setFinalData] = useState<AddVehicleRequestType>({
    agencyId: props.agencyId,
    data: {
      vehicleNumber: "",
      type: VehicleTypesEnum.CAR,
      brand: VehicleBrandEnum.Honda,
      color: VehicleColorEnum.White,
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

  const { currentStepIndex, isLastStep, nextStep, prevStep, steps } =
    useMultiStepForm([
      <AddVehicleStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddVehicleStep2
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddVehicleStep3
        key={2}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddVehicleStep4
        key={3}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddVehicleConfirm
        key={4}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
      />,
      <AddVehicleFinish key={5} />,
    ])

  return (
    <>
      <OnboardingStepPage pageId="AddVehiclePage">
        {currentStepIndex < AddVehicleTotalSteps && (
          <OnboardingStepHeader
            headerId="AddVehicleHeader"
            totalSteps={AddVehicleTotalSteps}
            currentStepIndex={currentStepIndex}
            title={t("Title")}
            stepLabel={t("Description", {
              step: currentStepIndex + 1,
              total: AddVehicleTotalSteps,
            })}
          />
        )}
        {steps[currentStepIndex]}
      </OnboardingStepPage>
      <OnboardingSidebar
        currentProcess={2}
        isLastStep={isLastStep}
        showLogout
      />
    </>
  )
}
