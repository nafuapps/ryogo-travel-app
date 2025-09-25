import { H3Grey } from "@/components/typography";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import ConfirmValues from "../../components/confirmValues";
import { AddVehicleFinalDataType } from "../../components/finalDataTypes";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../../components/onboardingSteps";
import { Form } from "@/components/ui/form";

export function AddVehicleConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddVehicleFinalDataType;
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Confirm");
  const formData = useForm<AddVehicleFinalDataType>();
  //Submit actions
  const onSubmit = (data: AddVehicleFinalDataType) => {
    console.log({ data });
    // TODO: Add vehicle to Agency
    props.onNext();
  };
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step5Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step5Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues
            name={t("VehicleNumber")}
            value={props.finalData.vehicleNumber}
          />
          <ConfirmValues name={t("Type")} value={props.finalData.type} />
          <ConfirmValues name={t("Brand")} value={props.finalData.brand} />
          <ConfirmValues name={t("Model")} value={props.finalData.model} />
          <ConfirmValues name={t("Color")} value={props.finalData.color} />
          <ConfirmValues
            name={t("Capacity")}
            value={`${props.finalData.capacity}`}
          />
          <ConfirmValues
            name={t("OdometerReading")}
            value={`${props.finalData.odometerReading}`}
          />
          <ConfirmValues
            name={t("InsuranceExpiresOn")}
            value={props.finalData.insuranceExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("PUCExpiresOn")}
            value={props.finalData.pucExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("RatePerKm")}
            value={`${props.finalData.defaultRatePerKm}`}
          />
          <ConfirmValues
            name={t("HasAC")}
            value={props.finalData.hasAC ? "Yes" : "No"}
          />
          {props.finalData.hasAC && (
            <ConfirmValues
              name={t("ACChagePerDay")}
              value={`${props.finalData.extraAcChargePerDay}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step5Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && (
              <Loader2Icon className="animate-spin" />
            )}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </OnboardingStepSecondaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  );
}
