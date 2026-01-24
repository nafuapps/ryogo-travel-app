/* eslint-disable react-hooks/immutability */
//(Onboarding) Add vehicle page
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/app/onboarding/components/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { CaptionGrey, H2 } from "@/components/typography"
import StepsTracker from "@/app/onboarding/components/stepsTracker"
import { useEffect, useState } from "react"
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "@/app/onboarding/components/onboardingSteps"
import { AddVehicleFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import { AddVehicleStep1 } from "./addVehicleStep1"
import { AddVehicleFinish } from "./addVehicleFinish"
import { AddVehicleStep2 } from "./addVehicleStep2"
import { AddVehicleStep3 } from "./addVehicleStep3"
import { AddVehicleStep4 } from "./addVehicleStep4"
import { AddVehicleConfirm } from "./addVehicleStep5"
import { fetchAgenyData } from "@/app/onboarding/components/fetchAgenyData"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"

const TotalSteps = 5

type AddVehiclePageComponentProps = {
  agencyId: string
  status: string
}
export default function AddVehiclePageComponent(
  props: AddVehiclePageComponentProps,
) {
  useEffect(() => {
    //Redirect if needed
    fetchAgenyData(props.agencyId, "add-vehicle")
  }, [props.agencyId])

  const t = useTranslations("Onboarding.AddVehiclePage")
  const [finalData, setFinalData] = useState<AddVehicleFormDataType>({
    agencyId: props.agencyId,
    vehicleNumber: "",
    type: VehicleTypesEnum.CAR,
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
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="AddVehicleHeader">
            <OnboardingStepHeaderTopLine>
              <H2>{t("Title")}</H2>
            </OnboardingStepHeaderTopLine>
            <StepsTracker total={TotalSteps} current={currentStepIndex} />
            <CaptionGrey>
              {t("Description", {
                step: currentStepIndex + 1,
                total: TotalSteps,
              })}
            </CaptionGrey>
          </OnboardingStepHeader>
        )}
        {steps[currentStepIndex]}
      </OnboardingStepPage>
      <OnboardingSidebar currentProcess={isLastStep ? 2 : 1} />
    </>
  )
}
