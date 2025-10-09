"use client";

import { useTranslations } from "next-intl";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import NewBookingStep1 from "./newBookingStep1";
import NewBookingStep2 from "./newBookingStep2";
import NewBookingStep3 from "./newBookingStep3";
import NewBookingStep4 from "./newBookingStep4";
import NewBookingFinal from "./newBookingFinal";
import { useState } from "react";
import { NewBookingFormDataType } from "./newBookingCommon";

export default function NewBookingForm() {
  const t = useTranslations("Dashboard.NewBooking.Form");
  const [newBookingFormData, setNewBookingFormData] =
    useState<NewBookingFormDataType>({
      customerPhone: "",
      tripNeedsAC: false,
    });

  const nextStepHandler = () => {
    nextStep();
  };

  const prevStepHandler = () => {
    prevStep();
  };

  const { currentStepIndex, isFirstStep, isLastStep, nextStep, prevStep } =
    useMultiStepForm([
      <NewBookingStep1
        key={0}
        onNext={nextStepHandler}
        newBookingFormData={newBookingFormData}
        setNewBookingFormData={setNewBookingFormData}
      />,
      <NewBookingStep2
        key={1}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        newBookingFormData={newBookingFormData}
        setNewBookingFormData={setNewBookingFormData}
      />,
      <NewBookingStep3
        key={2}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        newBookingFormData={newBookingFormData}
        setNewBookingFormData={setNewBookingFormData}
      />,
      <NewBookingStep4
        key={3}
        onNext={nextStepHandler}
        onPrev={prevStepHandler}
        newBookingFormData={newBookingFormData}
        setNewBookingFormData={setNewBookingFormData}
      />,
      <NewBookingFinal
        key={4}
        onPrev={prevStepHandler}
        newBookingFormData={newBookingFormData}
      />,
    ]);

  return (
    <div
      id="newBookingForm"
      className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
    ></div>
  );
}
