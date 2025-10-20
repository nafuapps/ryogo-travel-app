import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AddDriverFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/app/onboarding/components/onboardingSteps";
import { Form } from "@/components/ui/form";
import { H3Grey } from "@/components/typography";
import ConfirmValues from "@/app/onboarding/components/confirmValues";
import {
  OnboardingAddDriverAPIRequestType,
  OnboardingAddDriverAPIResponseType,
  OnboardingSetActiveAPIResponseType,
} from "@ryogo-travel-app/api/types/user.types";
import {
  apiClient,
  apiClientWithoutHeaders,
} from "@ryogo-travel-app/api/client/apiClient";
import { redirect, RedirectType } from "next/navigation";
import { toast } from "sonner";

export function AddDriverConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddDriverFormDataType;
  ownerId: string;
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Confirm");
  const formData = useForm<AddDriverFormDataType>();
  //Submit actions
  const onSubmit = async () => {
    // Add driver
    const newDriverData: OnboardingAddDriverAPIRequestType = {
      agencyId: props.finalData.agencyId,
      data: {
        name: props.finalData.name,
        email: props.finalData.email,
        phone: props.finalData.phone,
        address: props.finalData.address,
        canDriveVehicleTypes: props.finalData.canDriveVehicleTypes,
        defaultAllowancePerDay: props.finalData.defaultAllowancePerDay,
        licenseNumber: props.finalData.licenseNumber,
        licenseExpiresOn: props.finalData.licenseExpiresOn!.toDateString(),
      },
    };
    const addedDriver = await apiClient<OnboardingAddDriverAPIResponseType>(
      "/api/onboarding/add-driver",
      { method: "POST", body: JSON.stringify(newDriverData) }
    );
    if (addedDriver.id) {
      //If success, Try to upload license photo and driver user photo
      if (props.finalData.licensePhotos) {
        const formData = new FormData();
        formData.append("license", props.finalData.licensePhotos[0]!);
        await apiClientWithoutHeaders(
          `/api/onboarding/add-driver/upload-license/${addedDriver.id}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }
      if (props.finalData.driverPhotos) {
        const formData = new FormData();
        formData.append("file", props.finalData.driverPhotos[0]!);
        await apiClientWithoutHeaders(
          `/api/onboarding/upload-user-photo/${addedDriver.userId}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }
      //Set owner and agency status as ACTIVE
      await apiClient<OnboardingSetActiveAPIResponseType>(
        `/api/onboarding/set-active/${props.ownerId}`,
        {
          method: "POST",
        }
      );
      //Move to next step
      props.onNext();
    } else {
      //If failed, Take back to driver onboarding page and show error
      toast.error(t("APIError"));
      redirect("/onboarding/add-driver", RedirectType.replace);
    }
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
          {props.finalData.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${props.finalData.defaultAllowancePerDay}`}
            />
          )}
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
