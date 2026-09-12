/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { useState } from "react"
import { AddAgentStep1 } from "./addAgentStep1"
import { AddAgentFinish } from "./addAgentFinish"
import { AddAgentConfirm } from "./addAgentStep2"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { AddAgentTotalSteps } from "@/lib/uiConfig"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"

export default function AddAgentPageComponent({
  agencyId,
  agencyName,
  allAgents,
}: {
  agencyId: string
  agencyName: string
  allAgents: FindAllUsersByRoleType
}) {
  const t = useTranslations("Onboarding.AddAgentPage")

  const [finalData, setFinalData] = useState<AddAgentRequestType>({
    agencyId: agencyId,
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
        allAgents={allAgents}
      />,
      <AddAgentConfirm
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
      />,
      <AddAgentFinish key={2} finalData={finalData} agencyName={agencyName} />,
    ])

  return (
    <>
      <OnboardingPageWrapper id="AddAgentPage">
        {currentStepIndex < AddAgentTotalSteps && (
          <OnboardingStepHeader
            totalSteps={AddAgentTotalSteps}
            currentStepIndex={currentStepIndex}
            title={t("Title")}
            stepLabel={t("Description", {
              step: currentStepIndex + 1,
              total: AddAgentTotalSteps,
            })}
          />
        )}
        {steps[currentStepIndex]}
      </OnboardingPageWrapper>
      <OnboardingSidebar
        currentProcess={4}
        isLastStep={isLastStep}
        showLogout
      />
    </>
  )
}
