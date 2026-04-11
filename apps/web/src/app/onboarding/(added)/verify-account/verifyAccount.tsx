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
} from "@/app/onboarding/components/onboardingSteps"
import { VerifyAccountStep1 } from "./verifyAccountStep1"
import { VerifyAccountFinish } from "./verifyAccountFinish"
import { differenceInMinutes } from "date-fns"

const TotalSteps = 1

type VerifyAccountPageComponentProps = {
  updatedAt?: Date
}
export default function VerifyAccountPageComponent(
  props: VerifyAccountPageComponentProps,
) {
  const t = useTranslations("Onboarding.VerifyAccountPage")

  const nextStepHandler = () => {
    nextStep()
  }

  const { currentStepIndex, isLastStep, nextStep, prevStep, steps } =
    useMultiStepForm([
      <VerifyAccountStep1
        key={0}
        onNext={nextStepHandler}
        canResend={
          props.updatedAt
            ? differenceInMinutes(new Date(), props.updatedAt) > 5
            : true
        }
      />,
      <VerifyAccountFinish key={1} />,
    ])

  return (
    <>
      <OnboardingStepPage pageId="VerifyAccountPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="VerifyAccountHeader">
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
      <OnboardingSidebar currentProcess={1} isLastStep={isLastStep} />
    </>
  )
}
