/* eslint-disable react-hooks/immutability */
//(Onboarding) Add vehicle page
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/app/onboarding/components/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { CaptionGrey, H2 } from "@/components/typography"
import StepsTracker from "@/app/onboarding/components/stepsTracker"
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
  VerifyAccountTotalSteps,
} from "@/app/onboarding/components/onboardingSteps"
import { VerifyAccountStep1 } from "./verifyAccountStep1"
import { VerifyAccountFinish } from "./verifyAccountFinish"
import { differenceInMinutes } from "date-fns"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

type VerifyAccountPageComponentProps = {
  updatedAt?: Date
}
export default function VerifyAccountPageComponent(
  props: VerifyAccountPageComponentProps,
) {
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
        props.updatedAt ? differenceInMinutes(new Date(), props.updatedAt) : 999
      }
    />,
    <VerifyAccountFinish key={1} />,
  ])

  return (
    <>
      <OnboardingStepPage pageId="VerifyAccountPage">
        {currentStepIndex < VerifyAccountTotalSteps && (
          <OnboardingStepHeader headerId="VerifyAccountHeader">
            <OnboardingStepHeaderTopLine>
              <H2>{t("Title")}</H2>
            </OnboardingStepHeaderTopLine>
            <StepsTracker
              total={VerifyAccountTotalSteps}
              current={currentStepIndex}
            />
            <CaptionGrey>
              {t("Description", {
                step: currentStepIndex + 1,
                total: VerifyAccountTotalSteps,
              })}
            </CaptionGrey>
          </OnboardingStepHeader>
        )}
        {steps[currentStepIndex]}
      </OnboardingStepPage>
      <OnboardingSidebar currentProcess={1} isLastStep={isLastStep} />
    </>
  )
}
