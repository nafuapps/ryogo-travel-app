/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { CaptionGrey, H2 } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
import { useState } from "react"
import {
  AddVehicleTotalSteps,
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "@/components/onboarding/onboardingSteps"
import { AddVehicleStep1 } from "./addVehicleStep1"
import { AddVehicleFinish } from "./addVehicleFinish"
import { AddVehicleStep2 } from "./addVehicleStep2"
import { AddVehicleStep3 } from "./addVehicleStep3"
import { AddVehicleStep4 } from "./addVehicleStep4"
import { AddVehicleConfirm } from "./addVehicleStep5"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"

type AddVehiclePageComponentProps = {
  agencyId: string
  status: string
}
export default function AddVehiclePageComponent(
  props: AddVehiclePageComponentProps,
) {
  const t = useTranslations("Onboarding.AddVehiclePage")
  const [finalData, setFinalData] = useState<AddVehicleRequestType>({
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
          <OnboardingStepHeader headerId="AddVehicleHeader">
            <OnboardingStepHeaderTopLine>
              <H2>{t("Title")}</H2>
            </OnboardingStepHeaderTopLine>
            <StepsTracker
              total={AddVehicleTotalSteps}
              current={currentStepIndex}
            />
            <CaptionGrey>
              {t("Description", {
                step: currentStepIndex + 1,
                total: AddVehicleTotalSteps,
              })}
            </CaptionGrey>
          </OnboardingStepHeader>
        )}
        {steps[currentStepIndex]}
      </OnboardingStepPage>
      <OnboardingSidebar currentProcess={2} isLastStep={isLastStep} />
    </>
  )
}
