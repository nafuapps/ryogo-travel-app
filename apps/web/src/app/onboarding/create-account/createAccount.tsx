//(Onboarding) Add agency and owner page
"use client";

import { useTranslations } from "next-intl";
import OnboardingSidebar from "../components/onboardingSidebar";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { CaptionGrey, H2 } from "@/components/typography";
import StepsTracker from "../components/stepsTracker";
import { CreateAccountFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import { CreateAccountFinish } from "./createAccountFinish";
import { CreateAccountStep1 } from "./createAccountStep1";
import { CreateAccountStep2 } from "./createAccountStep2";
import { CreateAccountStep3 } from "./createAccountStep3";
import { CreateAccountStep4 } from "./createAccountStep4";
import { CreateAccountConfirm } from "./createAccountStep5";
import { useState } from "react";
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "../components/onboardingSteps";

const TotalSteps = 5;

export default function CreateAccountPageComponent() {
  const t = useTranslations("Onboarding.CreateAccountPage");

  const [finalData, setFinalData] = useState<CreateAccountFormDataType>({
    agencyName: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    agencyPhone: "",
    agencyEmail: "",
    agencyAddress: "",
    ownerPhoto: undefined,
    agencyLogo: undefined,
    commissionRate: undefined,
    agencyState: "",
    agencyCity: "",
    password: "",
    confirmPassword: "",
  });

  const nextStepHandler = () => {
    nextStep();
  };

  const prevStepHandler = () => {
    prevStep();
  };

  const { currentStepIndex, isLastStep, nextStep, prevStep, steps } =
    useMultiStepForm([
      <CreateAccountStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <CreateAccountStep2
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
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
    ]);

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
  );
}
