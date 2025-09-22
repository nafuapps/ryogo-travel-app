import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AddAgentFinalDataType } from "../components/finalDataTypes";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../components/onboardingSteps";
import { Form } from "@/components/ui/form";
import { H3Grey } from "@/components/typography";
import ConfirmValues from "../components/confirmValues";

export function AddAgentConfirm(props: {
  onNext: () => void;
  onPrev: () => void;
  finalData: AddAgentFinalDataType;
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Confirm");
  const formData = useForm<AddAgentFinalDataType>();
  //Submit actions
  const onSubmit = (data: AddAgentFinalDataType) => {
    console.log({ data });
    // TODO: Add Agent to Agency
    props.onNext();
  };
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step2Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step2Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues name={t("AgentName")} value={props.finalData.name} />
          <ConfirmValues name={t("AgentPhone")} value={props.finalData.phone} />
          <ConfirmValues name={t("AgentEmail")} value={props.finalData.email} />
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
