/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useState } from "react"
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
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { AddVehicleTotalSteps } from "@/lib/uiConfig"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"

export default function AddVehiclePageComponent({
  agencyId,
  userId,
}: {
  agencyId: string
  userId: string
}) {
  const t = useTranslations("Onboarding.AddVehiclePage")
  const [finalData, setFinalData] = useState<AddVehicleRequestType>({
    agencyId: agencyId,
    addedByUserId: userId,
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
      <OnboardingPageWrapper id="AddVehiclePage">
        {currentStepIndex < AddVehicleTotalSteps && (
          <OnboardingStepHeader
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
      </OnboardingPageWrapper>
      <OnboardingSidebar
        currentProcess={2}
        isLastStep={isLastStep}
        showLogout
      />
    </>
  )
}
