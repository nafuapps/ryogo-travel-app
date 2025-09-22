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

export function CreateAccountConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: CreateAccountFinalDataType;
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Confirm");
  const formData = useForm<CreateAccountFinalDataType>();
  //Submit actions
  const onSubmit = (data: CreateAccountFinalDataType) => {
    console.log({ data });
    // TODO: Create Agency and Account
    // TODO: Login user and create session
    props.onNext();
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
          <ConfirmValues
            name={t("CommissionRate")}
            value={`${props.finalData.commissionRate}`}
          />
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
