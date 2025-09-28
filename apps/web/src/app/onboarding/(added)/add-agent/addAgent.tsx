//(Onboarding) Add agent page
"use client";

import { useTranslations } from "next-intl";
import OnboardingSidebar from "../../components/onboardingSidebar";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { CaptionGrey, H2 } from "@/components/typography";
import StepsTracker from "../../components/stepsTracker";
import { useEffect, useState } from "react";
import {
  OnboardingStepHeader,
  OnboardingStepPage,
} from "../../components/onboardingSteps";
import { AddAgentFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import { AddAgentStep1 } from "./addAgentStep1";
import { AddAgentFinish } from "./addAgentFinish";
import { AddAgentConfirm } from "./addAgentStep2";
import { apiClient } from "@/lib/apiClient";
import { OnboardingCheckAgentAgencyAPIResponseType } from "@ryogo-travel-app/api/types/user.types";
import { redirect, RedirectType } from "next/navigation";

export async function fetchAgentsInAgency(agencyId: string) {
  const fetchedAgents =
    await apiClient<OnboardingCheckAgentAgencyAPIResponseType>(
      `/api/onboarding/add-agent/check-agent-agency/${agencyId}`,
      {
        method: "GET",
      }
    );
  return fetchedAgents.length > 0;
}

const TotalSteps = 2;

export type AgentCheckedType = {
  [key: string]: boolean; // Keys are [phone+email] , values are boolean
};

type AddAgentComponentProps = {
  agencyId: string;
};
export default function AddAgentComponent(props: AddAgentComponentProps) {
  const [agentExists, setAgentExists] = useState(false);

  //Get agent list from DB
  useEffect(() => {
    fetchAgentsInAgency(props.agencyId).then((data) => {
      setAgentExists(data);
    });
  }, [props.agencyId]);

  //If agent already added, skip to dashboard
  if (agentExists) {
    redirect("/dashboard", RedirectType.replace);
  }

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
