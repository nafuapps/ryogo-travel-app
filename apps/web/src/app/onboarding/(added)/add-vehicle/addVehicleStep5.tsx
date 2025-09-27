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
import {
  OnboardingAddVehicleAPIRequestType,
  OnboardingAddVehicleAPIResponseType,
} from "@ryogo-travel-app/api/types/vehicle.types";
import { apiClient, apiClientWithoutHeaders } from "@/lib/apiClient";
import { toast } from "sonner";
import { redirect, RedirectType } from "next/navigation";

export function AddVehicleConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddVehicleFinalDataType;
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Confirm");
  const formData = useForm<AddVehicleFinalDataType>();

  //Submit actions
  const onSubmit = async () => {
    console.log(props.finalData);
    const newVehicleData: OnboardingAddVehicleAPIRequestType = {
      agencyId: props.finalData.agencyId,
      data: {
        vehicleNumber: props.finalData.vehicleNumber,
        type: props.finalData.type,
        brand: props.finalData.brand,
        color: props.finalData.color,
        model: props.finalData.model,
        capacity: props.finalData.capacity,
        odometerReading: props.finalData.odometerReading,
        insuranceExpiresOn: props.finalData.insuranceExpiresOn!.toDateString(),
        pucExpiresOn: props.finalData.pucExpiresOn!.toDateString(),
        hasAC: props.finalData.hasAC,
        defaultRatePerKm: props.finalData.defaultRatePerKm,
        extraAcChargePerDay: props.finalData.extraAcChargePerDay,
      },
    };
    const addedVehicle = await apiClient<OnboardingAddVehicleAPIResponseType>(
      "/api/onboarding/add-vehicle",
      { method: "POST", body: JSON.stringify(newVehicleData) }
    );
    console.log(addedVehicle);
    if (addedVehicle.id) {
      //Try to upload vehicle docs
      const formData = new FormData();
      if (props.finalData.rcPhotos) {
        formData.append("rc", props.finalData.rcPhotos[0]!);
      }
      if (props.finalData.insurancePhotos) {
        formData.append("insurance", props.finalData.insurancePhotos[0]!);
      }
      if (props.finalData.pucPhotos) {
        formData.append("puc", props.finalData.pucPhotos[0]!);
      }
      if (props.finalData.vehiclePhotos) {
        formData.append("vehicle", props.finalData.vehiclePhotos[0]!);
      }
      await apiClientWithoutHeaders(
        `/api/onboarding/add-vehicle/upload-docs/${addedVehicle.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      props.onNext();
    } else {
      toast.error(t("APIError"));
      redirect("/onboarding/add-driver", RedirectType.replace);
    }
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
          {props.finalData.capacity && (
            <ConfirmValues
              name={t("Capacity")}
              value={`${props.finalData.capacity}`}
            />
          )}
          {props.finalData.odometerReading && (
            <ConfirmValues
              name={t("OdometerReading")}
              value={`${props.finalData.odometerReading}`}
            />
          )}
          <ConfirmValues
            name={t("InsuranceExpiresOn")}
            value={props.finalData.insuranceExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("PUCExpiresOn")}
            value={props.finalData.pucExpiresOn!.toDateString()}
          />
          {props.finalData.defaultRatePerKm && (
            <ConfirmValues
              name={t("RatePerKm")}
              value={`${props.finalData.defaultRatePerKm}`}
            />
          )}
          <ConfirmValues
            name={t("HasAC")}
            value={props.finalData.hasAC ? "Yes" : "No"}
          />
          {props.finalData.hasAC && props.finalData.extraAcChargePerDay && (
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
