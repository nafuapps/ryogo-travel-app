/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { VerifyAccountStep1 } from "./verifyAccountStep1"
import { VerifyAccountFinish } from "./verifyAccountFinish"
import { differenceInMinutes } from "date-fns"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { VerifyAccountTotalSteps } from "@/lib/uiConfig"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"

export default function VerifyAccountPageComponent({
  code,
  codeSentAt,
}: {
  code: string
  codeSentAt?: Date | null
}) {
  const t = useTranslations("Onboarding.VerifyAccountPage")
  const router = useRouter()

  const nextStepHandler = () => {
    nextStep()
  }

  //Refresh page to check if the resend timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 60000) // 60,000ms = 1 minute

    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

  const { currentStepIndex, isLastStep, nextStep, steps } = useMultiStepForm([
    <VerifyAccountStep1
      key={0}
      onNext={nextStepHandler}
      resendDifference={
        codeSentAt ? differenceInMinutes(new Date(), codeSentAt) : 999
      }
      code={code}
    />,
    <VerifyAccountFinish key={1} />,
  ])

  return (
    <>
      <OnboardingPageWrapper id="VerifyAccountPage">
        {currentStepIndex < VerifyAccountTotalSteps && (
          <OnboardingStepHeader
            totalSteps={VerifyAccountTotalSteps}
            currentStepIndex={currentStepIndex}
            title={t("Title")}
            stepLabel={t("Description", {
              step: currentStepIndex + 1,
              total: VerifyAccountTotalSteps,
            })}
          />
        )}
        {steps[currentStepIndex]}
      </OnboardingPageWrapper>
      <OnboardingSidebar currentProcess={1} isLastStep={isLastStep} />
    </>
  )
}
