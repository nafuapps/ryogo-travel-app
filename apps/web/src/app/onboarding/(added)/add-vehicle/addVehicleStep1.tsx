import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  OnboardingInput,
  OnboardingSelect,
} from "../../components/onboardingFields";
import { AddVehicleFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import {
  OnboardingStepActions,
  OnboardingStepContent,
  OnboardingStepForm,
  OnboardingStepPrimaryAction,
} from "../../components/onboardingSteps";
import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";

export function AddVehicleStep1(props: {
  onNext: () => void;
  finalData: AddVehicleFormDataType;
  updateFinalData: Dispatch<SetStateAction<AddVehicleFormDataType>>;
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Step1");
  const step1Schema = z.object({
    vehicleNumber: z
      .string()
      .trim()
      .min(7, t("Field1.Error1"))
      .max(15, t("Field1.Error2")),
    type: z.string().min(1, t("Field2.Error1")),
    brand: z.string().min(3, t("Field3.Error1")).max(15, t("Field3.Error2")),
    color: z.string().min(3, t("Field4.Error1")).max(15, t("Field4.Error2")),
    model: z.string().min(3, t("Field5.Error1")).max(30, t("Field5.Error2")),
  });
  type Step1Type = z.infer<typeof step1Schema>;

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      vehicleNumber: props.finalData.vehicleNumber,
      type: props.finalData.type,
      brand: props.finalData.brand,
      color: props.finalData.color,
      model: props.finalData.model,
    },
  });

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    props.updateFinalData({
      ...props.finalData,
      vehicleNumber: data.vehicleNumber,
      type: data.type,
      brand: data.brand,
      color: data.color,
      model: data.model,
    });
    props.onNext();
  };

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step1Content">
          <OnboardingInput
            name={"vehicleNumber"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingSelect
            name={"type"}
            register={formData.register("type")}
            array={["Car", "Bus", "Truck", "Bike", "Other"]}
            title={t("Field2.Title")}
            placeholder={t("Field2.Title")}
          />
          <OnboardingInput
            name={"brand"}
            type="text"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <OnboardingInput
            name={"color"}
            type="text"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <OnboardingInput
            name={"model"}
            type="text"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && (
              <Loader2Icon className="animate-spin" />
            )}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  );
}
