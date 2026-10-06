/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { VerifyAccountStep1 } from "./verifyAccountStep1"
import { VerifyAccountFinish } from "./verifyAccountFinish"
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { VerifyAccountTotalSteps } from "@/lib/uiConfig"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"

export default function VerifyAccountPageComponent({
  userId,
  codeSentAt,
}: {
  userId: string
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
      codeSentAt={codeSentAt}
    />,
    <VerifyAccountFinish key={1} />,
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
