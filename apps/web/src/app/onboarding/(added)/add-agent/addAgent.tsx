/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { RyogoCaption, RyogoH2 } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
import { useState } from "react"
import {
  AddAgentTotalSteps,
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "@/components/flows/onboarding/onboardingSteps"
import { AddAgentStep1 } from "./addAgentStep1"
import { AddAgentFinish } from "./addAgentFinish"
import { AddAgentConfirm } from "./addAgentStep2"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"

type AddAgentPageComponentProps = {
  agencyId: string
  agencyName: string
  ownerId: string
  status: UserStatusEnum
  allAgents: FindAllUsersByRoleType
}
export default function AddAgentPageComponent(
  props: AddAgentPageComponentProps,
) {
  const t = useTranslations("Onboarding.AddAgentPage")

  const [finalData, setFinalData] = useState<AddAgentRequestType>({
    agencyId: props.agencyId,
    data: {
      name: "",
      phone: "",
      email: "",
      photos: undefined,
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
      <AddAgentFinish
        key={2}
        finalData={finalData}
        agencyName={props.agencyName}
      />,
    ])

  return (
    <>
      <OnboardingStepPage pageId="AddAgentPage">
        {currentStepIndex < AddAgentTotalSteps && (
          <OnboardingStepHeader headerId="AddAgentHeader">
            <OnboardingStepHeaderTopLine>
              <RyogoH2>{t("Title")}</RyogoH2>
            </OnboardingStepHeaderTopLine>
            <StepsTracker
              total={AddAgentTotalSteps}
              current={currentStepIndex}
            />
            <RyogoCaption color="light">
              {t("Description", {
                step: currentStepIndex + 1,
                total: AddAgentTotalSteps,
              })}
            </RyogoCaption>
          </OnboardingStepHeader>
        )}
        {steps[currentStepIndex]}
      </OnboardingStepPage>
      <OnboardingSidebar currentProcess={4} isLastStep={isLastStep} />
    </>
  )
}
