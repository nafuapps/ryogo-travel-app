import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AddDriverFinalDataType } from "../components/finalDataTypes";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../components/onboardingSteps";
import { Form } from "@/components/ui/form";
import { H3Grey } from "@/components/typography";
import ConfirmValues from "../components/confirmValues";

export function AddDriverConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddDriverFinalDataType;
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Confirm");
  const formData = useForm<AddDriverFinalDataType>();
  //Submit actions
  const onSubmit = (data: AddDriverFinalDataType) => {
    console.log({ data });
    // TODO: Add driver to Agency
    props.onNext();
  };
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues name={t("DriverName")} value={props.finalData.name} />
          <ConfirmValues
            name={t("DriverPhone")}
            value={props.finalData.phone}
          />
          <ConfirmValues
            name={t("DriverEmail")}
            value={props.finalData.email}
          />
          <ConfirmValues
            name={t("LicenseNumber")}
            value={props.finalData.licenseNumber}
          />
          <ConfirmValues
            name={t("LicenseExpiresOn")}
            value={props.finalData.licenseExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("DriverAddress")}
            value={props.finalData.address}
          />
          <ConfirmValues
            name={t("CanDriveVehicleTypes")}
            value={props.finalData.canDriveVehicleTypes.join(", ")}
          />
          <ConfirmValues
            name={t("DefaultAllowancePerDay")}
            value={`${props.finalData.defaultAllowancePerDay}`}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step4Actions">
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
