import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AddVehicleFinalDataType } from "../../components/finalDataTypes";
import {
  OnboardingInput,
  OnboardingSwitch,
} from "../../components/onboardingFields";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../../components/onboardingSteps";
import { Form } from "@/components/ui/form";

export function AddVehicleStep4(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddVehicleFinalDataType;
  updateFinalData: Dispatch<SetStateAction<AddVehicleFinalDataType>>;
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Step4");
  const step4Schema = z.object({
    defaultRatePerKm: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(1, t("Field1.Error2"))
      .max(50, t("Field1.Error3"))
      .positive(t("Field1.Error4"))
      .multipleOf(1, t("Field1.Error5")),
    hasAC: z.boolean(),
    extraAcChargePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(1, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5")),
  });
  type Step4Type = z.infer<typeof step4Schema>;
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      defaultRatePerKm: props.finalData.defaultRatePerKm,
      hasAC: props.finalData.hasAC,
      extraAcChargePerDay: props.finalData.extraAcChargePerDay,
    },
  });

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    props.updateFinalData({
      ...props.finalData,
      defaultRatePerKm: data.defaultRatePerKm,
      hasAC: data.hasAC,
      extraAcChargePerDay: data.extraAcChargePerDay,
    });
    props.onNext();
  };
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <OnboardingInput
            name={"defaultRatePerKm"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingSwitch name={"hasAC"} label={t("Field2.Title")} />
          <OnboardingInput
            name={"extraAcChargePerDay"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
            disabled={!formData.watch("hasAC")}
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
