//(Onboarding) Add driver page
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
import { AddDriverFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import { AddDriverStep1 } from "./addDriverStep1";
import { AddDriverFinish } from "./addDriverFinish";
import { AddDriverStep2 } from "./addDriverStep2";
import { AddDriverStep3 } from "./addDriverStep3";
import { AddDriverConfirm } from "./addDriverStep4";
import { apiClient } from "@/lib/apiClient";
import { OnboardingCheckDriverAgencyAPIResponseType } from "@ryogo-travel-app/api/types/driver.types";
import { redirect, RedirectType } from "next/navigation";

export async function fetchDriversInAgency(agencyId: string) {
  const fetchedDrivers =
    await apiClient<OnboardingCheckDriverAgencyAPIResponseType>(
      `/api/onboarding/add-driver/check-driver-agency/${agencyId}`,
      {
        method: "GET",
      }
    );
  return fetchedDrivers.length > 0;
}

const TotalSteps = 4;

export type DriverCheckedType = {
  [key: string]: boolean; // Keys are [phone+email] , values are boolean
};
type AddDriverComponentProps = {
  agencyId: string;
  userId: string;
  userStatus: string;
};
export default function AddDriverComponent(props: AddDriverComponentProps) {
  const [driverExists, setDriverExists] = useState(false);

  //Get driver list from DB
  useEffect(() => {
    fetchDriversInAgency(props.agencyId).then((data) => {
      setDriverExists(data);
    });
  }, [props.agencyId]);

  //If driver already added
  if (driverExists) {
    if (props.userStatus == "new") {
      //If user is still new, take to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace);
    } else {
      //If user is not new, take to add agent
      redirect("/onboarding/add-agent", RedirectType.replace);
    }
  }

  const t = useTranslations("Onboarding.AddDriverPage");

  const [checkedDrivers, setCheckedDrivers] = useState<DriverCheckedType>({});

  const [finalData, setFinalData] = useState<AddDriverFormDataType>({
    agencyId: props.agencyId,
    name: "",
    phone: "",
    email: "",
    address: "",
    licenseNumber: "",
    licenseExpiresOn: undefined,
    licensePhotos: undefined,
    driverPhotos: undefined,
    canDriveVehicleTypes: [],
    defaultAllowancePerDay: undefined,
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
        checkedDrivers={checkedDrivers}
        setCheckedDrivers={setCheckedDrivers}
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
        ownerId={props.userId}
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
