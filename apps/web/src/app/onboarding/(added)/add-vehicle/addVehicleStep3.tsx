import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AddVehicleFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import {
  OnboardingDatePicker,
  OnboardingFileInput,
} from "../../components/onboardingFields";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepSecondaryAction,
  OnboardingStepPrimaryAction,
} from "../../components/onboardingSteps";
import { Form } from "@/components/ui/form";

export function AddVehicleStep3(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddVehicleFormDataType;
  updateFinalData: Dispatch<SetStateAction<AddVehicleFormDataType>>;
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Step3");
  const step3Schema = z.object({
    insuranceExpiresOn: z
      .date(t("Field1.Error1"))
      .min(new Date(), t("Field1.Error2"))
      .nonoptional(t("Field1.Error1")),
    insurancePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1;
      }, t("Field2.Error1"))
      .refine((file) => {
        if (file.length < 1) return false;
        return file[0]!.size < 1000000;
      }, t("Field2.Error2"))
      .refine((file) => {
        if (file.length < 1) return false;
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0]!.type)
        );
      }, t("Field2.Error3")),
    pucExpiresOn: z
      .date(t("Field3.Error1"))
      .min(new Date(), t("Field3.Error2"))
      .nonoptional(t("Field3.Error1")),
    pucPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1;
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return false;
        return file[0]!.size < 1000000;
      }, t("Field4.Error2"))
      .refine((file) => {
        if (file.length < 1) return false;
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0]!.type)
        );
      }, t("Field4.Error3")),
  });
  type Step3Type = z.infer<typeof step3Schema>;
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      insuranceExpiresOn: props.finalData.insuranceExpiresOn,
      insurancePhotos: props.finalData.insurancePhotos,
      pucExpiresOn: props.finalData.pucExpiresOn,
      pucPhotos: props.finalData.pucPhotos,
    },
  });

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    console.log({ data });
    props.updateFinalData({
      ...props.finalData,
      insuranceExpiresOn: data.insuranceExpiresOn,
      insurancePhotos: data.insurancePhotos,
      pucExpiresOn: data.pucExpiresOn,
      pucPhotos: data.pucPhotos,
    });
    props.onNext();
  };

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step3Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step3Content">
          <OnboardingDatePicker
            name="insuranceExpiresOn"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingFileInput
            name={"insurancePhotos"}
            register={formData.register("insurancePhotos")}
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingDatePicker
            name="pucExpiresOn"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <OnboardingFileInput
            name={"pucPhotos"}
            register={formData.register("pucPhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
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
