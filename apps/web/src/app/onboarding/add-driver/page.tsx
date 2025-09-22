//(Onboarding) Add driver page
"use client";

import { useTranslations } from "next-intl";
import OnboardingSidebar from "../components/onboardingSidebar";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { CaptionGrey, H2 } from "@/components/typography";
import StepsTracker from "../components/stepsTracker";
import { useState } from "react";
import {
  OnboardingStepHeader,
  OnboardingStepPage,
} from "../components/onboardingSteps";
import { AddDriverFinalDataType } from "../components/finalDataTypes";
import { AddDriverStep1 } from "./addDriverStep1";
import { AddDriverFinish } from "./addDriverFinish";
import { AddDriverStep2 } from "./addDriverStep2";
import { AddDriverStep3 } from "./addDriverStep3";
import { AddDriverConfirm } from "./addDriverStep4";

const TotalSteps = 4;

export default function AddDriverPage() {
  const t = useTranslations("Onboarding.AddDriverPage");

  const [finalData, setFinalData] = useState<AddDriverFinalDataType>({
    name: "",
    phone: "",
    email: "",
    address: "",
    licenseNumber: "",
    licenseExpiresOn: undefined,
    licensePhotos: undefined,
    driverPhotos: undefined,
    canDriveVehicleTypes: [],
    defaultAllowancePerDay: 500,
  });

  const nextStepHandler = () => {
    nextStep();
  };

  const prevStepHandler = () => {
    prevStep();
  };

  const { currentStepIndex, isLastStep, nextStep, prevStep, steps } =
    useMultiStepForm([
      <AddDriverStep1
        key={0}
        onNext={nextStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddDriverStep2
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddDriverStep3
        key={2}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        updateFinalData={setFinalData}
      />,
      <AddDriverConfirm
        key={3}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
      />,
      <AddDriverFinish key={4} finalData={finalData} />,
    ]);

  return (
    <>
      <OnboardingStepPage pageId="AddDriverPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="AddDriverHeader">
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
      <OnboardingSidebar currentProcess={isLastStep ? 3 : 2} />
    </>
  );
}
