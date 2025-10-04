import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { AddDriverFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import {
  OnboardingDatePicker,
  OnboardingFileInput,
  OnboardingInput,
} from "@/app/onboarding/components/onboardingFields";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepSecondaryAction,
  OnboardingStepPrimaryAction,
} from "@/app/onboarding/components/onboardingSteps";
import { Form } from "@/components/ui/form";

export function AddDriverStep2(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddDriverFormDataType;
  updateFinalData: Dispatch<SetStateAction<AddDriverFormDataType>>;
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step2");
  const step2Schema = z.object({
    licenseNumber: z
      .string()
      .trim()
      .min(12, t("Field1.Error1"))
      .max(20, t("Field1.Error2")),
    licenseExpiresOn: z
      .date(t("Field2.Error1"))
      .min(new Date(), t("Field2.Error2"))
      .nonoptional(t("Field2.Error1")),
    licensePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1;
      }, t("Field3.Error1"))
      .refine((file) => {
        if (file.length < 1) return false;
        return file[0]!.size < 1000000;
      }, t("Field3.Error2"))
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
      }, t("Field3.Error3")),
  });
  type Step2Type = z.infer<typeof step2Schema>;
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      licenseNumber: props.finalData.licenseNumber,
      licenseExpiresOn: props.finalData.licenseExpiresOn,
      licensePhotos: props.finalData.licensePhotos,
    },
  });

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    console.log({ data });
    props.updateFinalData({
      ...props.finalData,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      licensePhotos: data.licensePhotos,
    });
    props.onNext();
  };

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step2Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step2Content">
          <OnboardingInput
            name={"licenseNumber"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingDatePicker
            name="licenseExpiresOn"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingFileInput
            name={"licensePhotos"}
            register={formData.register("licensePhotos")}
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step2Actions">
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
