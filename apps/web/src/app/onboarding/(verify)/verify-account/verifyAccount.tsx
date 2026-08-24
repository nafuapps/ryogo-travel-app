/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import {
  OnboardingStepHeader,
  OnboardingStepPage,
  VerifyAccountTotalSteps,
} from "@/components/flows/onboarding/onboardingSteps"
import { VerifyAccountStep1 } from "./verifyAccountStep1"
import { VerifyAccountFinish } from "./verifyAccountFinish"
import { differenceInMinutes } from "date-fns"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VerifyAccountPageComponent(props: {
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
        props.codeSentAt
          ? differenceInMinutes(new Date(), props.codeSentAt)
          : 999
      }
      code={props.code}
    />,
    <VerifyAccountFinish key={1} />,
  ])

  return (
    <>
      <OnboardingStepPage pageId="VerifyAccountPage">
        {currentStepIndex < VerifyAccountTotalSteps && (
          <OnboardingStepHeader
            headerId="VerifyAccountHeader"
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
      </OnboardingStepPage>
      <OnboardingSidebar currentProcess={1} isLastStep={isLastStep} />
    </>
  )
}
