import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  OnboardingFileInput,
  OnboardingInput,
} from "../../components/onboardingFields";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
} from "../../components/onboardingSteps";
import { AddDriverFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import { Form } from "@/components/ui/form";
import { DriverCheckedType } from "./addDriver";
import { OnboardingExistingDriverAPIResponseType } from "@ryogo-travel-app/api/types/user.types";
import { apiClient } from "@/lib/apiClient";

export function AddDriverStep1(props: {
  onNext: () => void;
  finalData: AddDriverFormDataType;
  updateFinalData: Dispatch<SetStateAction<AddDriverFormDataType>>;
  checkedDrivers: DriverCheckedType;
  setCheckedDrivers: Dispatch<SetStateAction<DriverCheckedType>>;
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step1");

  const step1Schema = z.object({
    driverName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    driverPhone: z.string().length(10, t("Field2.Error1")),
    driverEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    driverPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true;
        return file[0] && file[0]!.size < 1000000;
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true;
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
          ].includes(file[0]!.type)
        );
      }, t("Field4.Error2"))
      .optional(),
  });

  type Step1Type = z.infer<typeof step1Schema>;

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: props.finalData.name,
      driverPhone: props.finalData.phone,
      driverEmail: props.finalData.email,
      driverPhotos: props.finalData.driverPhotos,
    },
  });

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    //Dictonary to store if the driver was already checked in the DB (to save API calls)
    const alreadyChecked = Object.keys(props.checkedDrivers).includes(
      data.driverPhone + data.driverEmail
    );
    if (!alreadyChecked) {
      //If (phone+email) not checked in DB already, make an API call
      const existingDriver =
        await apiClient<OnboardingExistingDriverAPIResponseType>(
          `/api/onboarding/add-driver/existing-driver?phone=${data.driverPhone}&email=${data.driverEmail}`,
          { method: "GET" }
        );
      if (existingDriver.length > 0) {
        //If driver exists in system, show error
        formData.setError("driverPhone", {
          type: "manual",
          message: t("APIError"),
        });
        //Store in dictionary
        props.setCheckedDrivers({
          ...props.checkedDrivers,
          [data.driverPhone + data.driverEmail]: true,
        });
      } else {
        //If driver does not exist in DB, store in dictionaty and move to next step
        props.setCheckedDrivers({
          ...props.checkedDrivers,
          [data.driverPhone + data.driverEmail]: false,
        });
      }
    } else {
      // If Driver was searched for already, take result from dictionary
      if (props.checkedDrivers[data.driverPhone + data.driverEmail]) {
        //If Driver exists in search dictionary and was in DB, show error
        formData.setError("driverPhone", {
          type: "manual",
          message: t("APIError"),
        });
      }
    }
    if (!formData.formState.errors.driverPhone) {
      props.updateFinalData({
        ...props.finalData,
        name: data.driverName,
        phone: data.driverPhone,
        email: data.driverEmail,
        driverPhotos: data.driverPhotos,
      });
      props.onNext();
    }
  };

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step1Content">
          <OnboardingInput
            name={"driverName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"driverPhone"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingInput
            name={"driverEmail"}
            type="email"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <OnboardingFileInput
            name={"agenctPhotos"}
            register={formData.register("driverPhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
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
