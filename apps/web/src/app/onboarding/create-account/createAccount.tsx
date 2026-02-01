/* eslint-disable react-hooks/immutability */
//(Onboarding) Add agency and owner page
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "../components/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { CaptionGrey, H2 } from "@/components/typography"
import StepsTracker from "../components/stepsTracker"
import { CreateAccountFinish } from "./createAccountFinish"
import { CreateAccountStep1 } from "./createAccountStep1"
import { CreateAccountStep2 } from "./createAccountStep2"
import { CreateAccountStep3 } from "./createAccountStep3"
import { CreateAccountStep4 } from "./createAccountStep4"
import { CreateAccountConfirm } from "./createAccountStep5"
import { useState } from "react"
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "../components/onboardingSteps"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { FindAllAgenciesType } from "@ryogo-travel-app/api/services/agency.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"

const TotalSteps = 5

export default function CreateAccountPageComponent({
  allOwners,
  allAgencies,
}: {
  allOwners: FindAllUsersByRoleType
  allAgencies: FindAllAgenciesType
}) {
  const t = useTranslations("Onboarding.CreateAccountPage")

  const [finalData, setFinalData] = useState<CreateOwnerAccountRequestType>({
    agency: {
      businessName: "",
      businessPhone: "",
      businessEmail: "",
      businessAddress: "",
      logo: undefined,
      commissionRate: undefined,
      agencyState: "",
      agencyCity: "",
    },
    owner: {
      name: "",
      phone: "",
      email: "",
      photos: undefined,
      password: "",
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
      <CreateAccountStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
        allOwners={allOwners}
      />,
      <CreateAccountStep2
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
        allAgencies={allAgencies}
      />,
      <CreateAccountStep3
        key={2}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <CreateAccountStep4
        key={3}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <CreateAccountConfirm
        key={4}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
      />,
      <CreateAccountFinish key={5} />,
    ])

  return (
    <>
      <OnboardingStepPage pageId="CreateAccountPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="CreateAccountHeader">
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
      <OnboardingSidebar currentProcess={isLastStep ? 1 : 0} />
    </>
  )
}
