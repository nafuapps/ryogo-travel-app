/* eslint-disable react-hooks/immutability */
//(Onboarding) Add agent page
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
import { AddAgentFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import { AddAgentStep1 } from "./addAgentStep1"
import { AddAgentFinish } from "./addAgentFinish"
import { AddAgentConfirm } from "./addAgentStep2"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"

const TotalSteps = 2

type AddAgentPageComponentProps = {
  agencyId: string
  ownerId: string
  status: UserStatusEnum
  allAgents: FindAllUsersByRoleType
}
export default function AddAgentPageComponent(
  props: AddAgentPageComponentProps,
) {
  const t = useTranslations("Onboarding.AddAgentPage")

  const [finalData, setFinalData] = useState<AddAgentFormDataType>({
    agencyId: props.agencyId,
    name: "",
    phone: "",
    email: "",
    agentPhotos: undefined,
  })

  const nextStepHandler = () => {
    nextStep()
  }

  const prevStepHandler = () => {
    prevStep()
  }

  const { currentStepIndex, isLastStep, nextStep, prevStep, steps } =
    useMultiStepForm([
      <AddAgentStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
        allAgents={props.allAgents}
      />,
      <AddAgentConfirm
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        status={props.status}
        ownerId={props.ownerId}
      />,
      <AddAgentFinish key={2} finalData={finalData} />,
    ])

  return (
    <>
      <OnboardingStepPage pageId="AddAgentPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="AddAgentHeader">
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
      <OnboardingSidebar currentProcess={isLastStep ? 4 : 3} />
    </>
  )
}
