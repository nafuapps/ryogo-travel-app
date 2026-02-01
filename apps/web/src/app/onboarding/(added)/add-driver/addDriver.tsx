/* eslint-disable react-hooks/immutability */
//(Onboarding) Add driver page
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/app/onboarding/components/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { CaptionGrey, H2 } from "@/components/typography"
import StepsTracker from "@/app/onboarding/components/stepsTracker"
import { useState } from "react"
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "@/app/onboarding/components/onboardingSteps"
import { AddDriverStep1 } from "./addDriverStep1"
import { AddDriverFinish } from "./addDriverFinish"
import { AddDriverStep2 } from "./addDriverStep2"
import { AddDriverStep3 } from "./addDriverStep3"
import { AddDriverConfirm } from "./addDriverStep4"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

const TotalSteps = 4

type AddDriverPageComponentProps = {
  agencyId: string
  userId: string
  userStatus: UserStatusEnum
  allDrivers: FindAllUsersByRoleType
}
export default function AddDriverPageComponent(
  props: AddDriverPageComponentProps,
) {
  const t = useTranslations("Onboarding.AddDriverPage")

  const [finalData, setFinalData] = useState<AddDriverRequestType>({
    agencyId: props.agencyId,
    data: {
      name: "",
      phone: "",
      email: "",
      licenseNumber: "",
      licenseExpiresOn: undefined,
      address: "",
      canDriveVehicleTypes: [],
      defaultAllowancePerDay: undefined,
      licensePhotos: undefined,
      userPhotos: undefined,
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
      <AddDriverStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
        allDrivers={props.allDrivers}
      />,
      <AddDriverStep2
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddDriverStep3
        key={2}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddDriverConfirm
        key={3}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        ownerId={props.userId}
        userStatus={props.userStatus}
      />,
      <AddDriverFinish key={4} finalData={finalData} />,
    ])

  return (
    <>
      <OnboardingStepPage pageId="AddDriverPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="AddDriverHeader">
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
      <OnboardingSidebar currentProcess={isLastStep ? 3 : 2} />
    </>
  )
}
