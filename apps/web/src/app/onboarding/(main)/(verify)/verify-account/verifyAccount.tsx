/* eslint-disable react-hooks/immutability */
"use client"

import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { VerifyAccountTotalSteps } from "@/lib/uiConfig"
import { useTranslations } from "next-intl"
import { VerifyAccountFinish } from "./verifyAccountFinish"
import { VerifyAccountStep1 } from "./verifyAccountStep1"

export default function VerifyAccountPageComponent({
  userId,
  agencyId,
  codeSentAt,
}: {
  userId: string
  agencyId: string
  codeSentAt: Date | null
}) {
  const t = useTranslations("Onboarding.VerifyAccountPage")

  const nextStepHandler = () => {
    nextStep()
  }

  const { currentStepIndex, isLastStep, nextStep, steps } = useMultiStepForm([
    <VerifyAccountStep1
      key={0}
      onNext={nextStepHandler}
      userId={userId}
      agencyId={agencyId}
      codeSentAt={codeSentAt}
    />,
    <VerifyAccountFinish key={1} agencyId={agencyId} />,
  ])

  return (
    <>
      <OnboardingPageWrapper id="VerifyAccountPage">
        <OnboardingStepHeader
          totalSteps={VerifyAccountTotalSteps}
          currentStepIndex={currentStepIndex}
          title={t("Title")}
          stepLabel={
            currentStepIndex >= VerifyAccountTotalSteps
              ? t("Completed")
              : t("Description", {
                  step: currentStepIndex + 1,
                  total: VerifyAccountTotalSteps,
                })
          }
          href={""} //TODO: update onboarding video link
        />
        {steps[currentStepIndex]}
      </OnboardingPageWrapper>
      <OnboardingSidebar currentProcess={1} isLastStep={isLastStep} />
    </>
  )
}
