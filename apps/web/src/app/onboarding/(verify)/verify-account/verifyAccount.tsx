/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { RyogoCaption, RyogoH2 } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
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
          <OnboardingStepHeader headerId="VerifyAccountHeader">
            <OnboardingStepHeaderTopLine>
              <RyogoH2>{t("Title")}</RyogoH2>
            </OnboardingStepHeaderTopLine>
            <StepsTracker
              steps={VerifyAccountTotalSteps}
              current={currentStepIndex}
            />
            <RyogoCaption color="light">
              {t("Description", {
                step: currentStepIndex + 1,
                total: VerifyAccountTotalSteps,
              })}
            </RyogoCaption>
          </OnboardingStepHeader>
        )}
        {steps[currentStepIndex]}
      </OnboardingStepPage>
      <OnboardingSidebar currentProcess={1} isLastStep={isLastStep} />
    </>
  )
}
