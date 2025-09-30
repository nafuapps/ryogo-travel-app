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
import { AddAgentFormDataType } from "@ryogo-travel-app/api/types/formDataTypes";
import { Form } from "@/components/ui/form";
import { AgentCheckedType } from "./addAgent";
import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { OnboardingExistingAgentAPIResponseType } from "@ryogo-travel-app/api/types/user.types";

export function AddAgentStep1(props: {
  onNext: () => void;
  finalData: AddAgentFormDataType;
  updateFinalData: Dispatch<SetStateAction<AddAgentFormDataType>>;
  checkedAgents: AgentCheckedType;
  setCheckedAgents: Dispatch<SetStateAction<AgentCheckedType>>;
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Step1");
  const step1Schema = z.object({
    agentName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    agentPhone: z.string().length(10, t("Field2.Error1")),
    agentEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    agentPhotos: z
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
      agentName: props.finalData.name,
      agentPhone: props.finalData.phone,
      agentEmail: props.finalData.email,
      agentPhotos: props.finalData.agentPhotos,
    },
  });

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    //Dictonary to store if the agent was already checked in the DB (to save API calls)
    const alreadyChecked = Object.keys(props.checkedAgents).includes(
      data.agentPhone + data.agentEmail
    );
    if (!alreadyChecked) {
      //If (phone+email) not checked in DB already, make an API call
      const existingAgent =
        await apiClient<OnboardingExistingAgentAPIResponseType>(
          `/api/onboarding/add-agent/existing-agent?phone=${data.agentPhone}&email=${data.agentEmail}`,
          { method: "GET" }
        );
      if (existingAgent.length > 0) {
        //If agent exists in system, show error
        formData.setError("agentPhone", {
          type: "manual",
          message: t("APIError"),
        });
        //Store in dictionary
        props.setCheckedAgents({
          ...props.checkedAgents,
          [data.agentPhone + data.agentEmail]: true,
        });
      } else {
        //If agent does not exist in DB, store in dictionaty and move to next step
        props.setCheckedAgents({
          ...props.checkedAgents,
          [data.agentPhone + data.agentEmail]: false,
        });
      }
    } else {
      // If Agent was searched for already, take result from dictionary
      if (props.checkedAgents[data.agentPhone + data.agentEmail]) {
        //If Agent exists in search dictionary and was in DB, show error
        formData.setError("agentPhone", {
          type: "manual",
          message: t("APIError"),
        });
      }
    }
    if (!formData.formState.errors.agentPhone) {
      //If no errors, move ahead
      props.updateFinalData({
        ...props.finalData,
        name: data.agentName,
        phone: data.agentPhone,
        email: data.agentEmail,
        agentPhotos: data.agentPhotos,
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
            name={"agentName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"agentPhone"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingInput
            name={"agentEmail"}
            type="email"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <OnboardingFileInput
            name={"agenctPhotos"}
            register={formData.register("agentPhotos")}
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
