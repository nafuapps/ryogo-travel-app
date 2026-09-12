/* eslint-disable react-hooks/immutability */
"use client"

import { useTranslations } from "next-intl"
import OnboardingSidebar from "@/components/flows/onboarding/onboardingSidebar"
import { useMultiStepForm } from "@/hooks/useMultiStepForm"
import { CreateAccountFinish } from "./createAccountFinish"
import { CreateAccountStep1 } from "./createAccountStep1"
import { CreateAccountStep2 } from "./createAccountStep2"
import { CreateAccountStep3 } from "./createAccountStep3"
import { CreateAccountStep4 } from "./createAccountStep4"
import { CreateAccountConfirm } from "./createAccountStep5"
import { useState } from "react"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { FindAllAgenciesType } from "@ryogo-travel-app/api/services/agency.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { OnboardingPageWrapper } from "@/components/page/pageWrappers"
import { CreateAccountTotalSteps } from "@/lib/uiConfig"
import OnboardingStepHeader from "@/components/flows/onboarding/onboardingStepHeader"

export default function CreateAccountPageComponent({
  allOwners,
  allAgencies,
  phone,
}: {
  allOwners: FindAllUsersByRoleType
  allAgencies: FindAllAgenciesType
  phone?: string
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
      qrCode: undefined,
      tryPremium: true,
    },
    owner: {
      name: "",
      phone: phone ?? "",
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
        updateFinalData={setFinalData}
      />,
      <CreateAccountFinish
        key={5}
        id={finalData.owner.id}
        password={finalData.owner.password}
      />,
    ])

  return (
    <>
      <OnboardingPageWrapper id="CreateAccountPage">
        {currentStepIndex < CreateAccountTotalSteps && (
          <OnboardingStepHeader
            totalSteps={CreateAccountTotalSteps}
            currentStepIndex={currentStepIndex}
            title={t("Title")}
            stepLabel={t("Description", {
              step: currentStepIndex + 1,
              total: CreateAccountTotalSteps,
            })}
          />
        )}
        {steps[currentStepIndex]}
      </OnboardingPageWrapper>
      <OnboardingSidebar currentProcess={0} isLastStep={isLastStep} />
    </>
  )
}
