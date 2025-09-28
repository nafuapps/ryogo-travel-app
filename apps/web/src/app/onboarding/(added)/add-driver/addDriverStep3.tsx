import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AddDriverFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import {
  OnboardingInput,
  OnboardingMultipleCheckbox,
  OnboardingTextarea,
} from "../../components/onboardingFields";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepSecondaryAction,
  OnboardingStepPrimaryAction,
} from "../../components/onboardingSteps";
import { Form } from "@/components/ui/form";

export function AddDriverStep3(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddDriverFormDataType;
  updateFinalData: Dispatch<SetStateAction<AddDriverFormDataType>>;
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step3");
  const step3Schema = z.object({
    driverAddress: z
      .string()
      .min(20, t("Field1.Error1"))
      .max(300, t("Field1.Error2")),
    canDriveVehicleTypes: z.array(z.string()).min(1, t("Field2.Error1")),
    defaultAllowancePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(1, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5")),
  });
  type Step3Type = z.infer<typeof step3Schema>;
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      driverAddress: props.finalData.address,
      canDriveVehicleTypes: props.finalData.canDriveVehicleTypes,
      defaultAllowancePerDay: props.finalData.defaultAllowancePerDay,
    },
  });

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    console.log({ data });
    props.updateFinalData({
      ...props.finalData,
      address: data.driverAddress,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
    });
    props.onNext();
  };

  const vehicles = ["Car", "Bus", "Truck", "Bike", "Other"];

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step3Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step3Content">
          <OnboardingTextarea
            name={"driverAddress"}
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
          />
          <OnboardingMultipleCheckbox
            array={vehicles}
            name={"canDriveVehicleTypes"}
            label={t("Field2.Title")}
            register={formData.register("canDriveVehicleTypes")}
          />
          <OnboardingInput
            name={"defaultAllowancePerDay"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step3Actions">
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
