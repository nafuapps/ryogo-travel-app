import { H3Grey } from "@/components/typography";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import ConfirmValues from "../components/confirmValues";
import { CreateAccountFinalDataType } from "../components/finalDataTypes";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../components/onboardingSteps";
import { Form } from "@/components/ui/form";
import {
  LoginPasswordAPIResponseType,
  OnboardingCreateAccountAPIRequestType,
  OnboardingCreateAccountAPIResponseType,
} from "@ryogo-travel-app/api/types/user.types";
import { apiClient, apiClientWithoutHeaders } from "@/lib/apiClient";
import { redirect, RedirectType } from "next/navigation";
import { toast } from "sonner";

export function CreateAccountConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: CreateAccountFinalDataType;
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Confirm");
  const formData = useForm<CreateAccountFinalDataType>();
  //Submit actions
  const onSubmit = async () => {
    console.log(props.finalData);
    // Create Agency and Owner Account
    const newAccountData: OnboardingCreateAccountAPIRequestType = {
      agency: {
        businessEmail: props.finalData.agencyEmail,
        businessPhone: props.finalData.agencyPhone,
        businessName: props.finalData.agencyName,
        businessAddress: props.finalData.agencyAddress,
        agencyCity: props.finalData.agencyCity,
        agencyState: props.finalData.agencyState,
        commissionRate: props.finalData.commissionRate,
      },
      owner: {
        email: props.finalData.ownerEmail,
        phone: props.finalData.ownerPhone,
        name: props.finalData.ownerName,
        password: props.finalData.password,
      },
    };
    const createdOwnerAccount =
      await apiClient<OnboardingCreateAccountAPIResponseType>(
        "/api/onboarding/create-account",
        { method: "POST", body: JSON.stringify(newAccountData) }
      );
    console.log(createdOwnerAccount);
    if (createdOwnerAccount.agencyId && createdOwnerAccount.userId) {
      //Try to upload business logo and owner photo
      if (props.finalData.agencyLogo) {
        const formData = new FormData();
        formData.append("file", props.finalData.agencyLogo[0]!);
        await apiClientWithoutHeaders(
          `/api/onboarding/create-account/upload-logo/${createdOwnerAccount.agencyId}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }
      if (props.finalData.ownerPhoto) {
        const formData = new FormData();
        formData.append("file", props.finalData.ownerPhoto[0]!);
        await apiClientWithoutHeaders(
          `/api/onboarding/create-account/upload-owner-photo/${createdOwnerAccount.userId}`,
          {
            method: "POST",
            body: formData,
          }
        );
      }

      //Login the new user
      await apiClient<LoginPasswordAPIResponseType>(
        "/api/auth/login/password",
        {
          method: "POST",
          body: JSON.stringify({
            userId: createdOwnerAccount.userId,
            password: props.finalData.password,
          }),
        }
      );
      //Move to next step
      props.onNext();
    } else {
      console.log(createdOwnerAccount);
      //Take to onboarding page and show error
      toast.error(t("APIError"));
      redirect("/onboarding", RedirectType.replace);
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
            name={t("AgencyName")}
            value={props.finalData.agencyName}
          />
          <ConfirmValues
            name={t("OwnerName")}
            value={props.finalData.ownerName}
          />
          <ConfirmValues
            name={t("OwnerPhone")}
            value={props.finalData.ownerPhone}
          />
          <ConfirmValues
            name={t("OwnerEmail")}
            value={props.finalData.ownerEmail}
          />
          <ConfirmValues
            name={t("AgencyPhone")}
            value={props.finalData.agencyPhone}
          />
          <ConfirmValues
            name={t("AgencyEmail")}
            value={props.finalData.agencyEmail}
          />
          <ConfirmValues
            name={t("AgencyAddress")}
            value={props.finalData.agencyAddress}
          />
          <ConfirmValues
            name={t("Location")}
            value={`${props.finalData.agencyCity}, ${props.finalData.agencyState}`}
          />
          {props.finalData.commissionRate && (
            <ConfirmValues
              name={t("CommissionRate")}
              value={`${props.finalData.commissionRate}`}
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
