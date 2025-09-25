//(Onboarding) Add agent page
"use client";

import { useTranslations } from "next-intl";
import OnboardingSidebar from "../../components/onboardingSidebar";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { CaptionGrey, H2 } from "@/components/typography";
import StepsTracker from "../../components/stepsTracker";
import { useState } from "react";
import {
  OnboardingStepHeader,
  OnboardingStepPage,
} from "../../components/onboardingSteps";
import { AddAgentFinalDataType } from "../../components/finalDataTypes";
import { AddAgentStep1 } from "./addAgentStep1";
import { AddAgentFinish } from "./addAgentFinish";
import { AddAgentConfirm } from "./addAgentStep2";

const TotalSteps = 2;

export default function AddAgentPage() {
  const t = useTranslations("Onboarding.AddAgentPage");

  const [finalData, setFinalData] = useState<AddAgentFinalDataType>({
    name: "",
    phone: "",
    email: "",
    agentPhotos: undefined,
  });

  const nextStepHandler = () => {
    nextStep();
  };

  const prevStepHandler = () => {
    prevStep();
  };

  const { currentStepIndex, isLastStep, nextStep, prevStep, steps } =
    useMultiStepForm([
      <AddAgentStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddAgentConfirm
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
      />,
      <AddAgentFinish key={2} finalData={finalData} />,
    ]);

  return (
    <>
      <OnboardingStepPage pageId="AddAgentPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="AddAgentHeader">
            <H2>{t("Title")}</H2>
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
      <OnboardingSidebar currentProcess={isLastStep ? 4 : 3} />
    </>
  );
}
