//(Onboarding) Add agent page
"use client";

import { useTranslations } from "next-intl";
import OnboardingSidebar from "@/app/onboarding/components/onboardingSidebar";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { CaptionGrey, H2 } from "@/components/typography";
import StepsTracker from "@/app/onboarding/components/stepsTracker";
import { useEffect, useState } from "react";
import {
  OnboardingStepHeader,
  OnboardingStepHeaderTopLine,
  OnboardingStepPage,
} from "@/app/onboarding/components/onboardingSteps";
import { AddAgentFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import { AddAgentStep1 } from "./addAgentStep1";
import { AddAgentFinish } from "./addAgentFinish";
import { AddAgentConfirm } from "./addAgentStep2";
import { fetchAgenyData } from "@/app/onboarding/components/fetchAgenyData";

const TotalSteps = 2;

export type AgentCheckedType = {
  [key: string]: boolean; // Keys are [phone+email] , values are boolean
};

type AddAgentComponentProps = {
  agencyId: string;
  ownerId: string;
  status: string;
};
export default function AddAgentComponent(props: AddAgentComponentProps) {
  useEffect(() => {
    //Redirect if needed
    fetchAgenyData(props.agencyId, "add-agent");
  }, [props.agencyId]);

  const t = useTranslations("Onboarding.AddAgentPage");
  const [checkedAgents, setCheckedAgents] = useState<AgentCheckedType>({});

  const [finalData, setFinalData] = useState<AddAgentFormDataType>({
    agencyId: props.agencyId,
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
        setCheckedAgents={setCheckedAgents}
        checkedAgents={checkedAgents}
      />,
      <AddAgentConfirm
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        finalData={finalData}
        status={props.status}
        ownerId={props.ownerId}
      />,
      <AddAgentFinish key={2} finalData={finalData} />,
    ]);

  return (
    <>
      <OnboardingStepPage pageId="AddAgentPage">
        {currentStepIndex < TotalSteps && (
          <OnboardingStepHeader headerId="AddAgentHeader">
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
      <OnboardingSidebar currentProcess={isLastStep ? 4 : 3} />
    </>
  );
}
