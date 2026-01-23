import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { AddAgentFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { H3Grey } from "@/components/typography"
import ConfirmValues from "@/app/onboarding/components/confirmValues"
import {
  OnboardingAddAgentAPIRequestType,
  OnboardingAddAgentAPIResponseType,
  OnboardingSetActiveAPIResponseType,
} from "@ryogo-travel-app/api/types/user.types"
import {
  apiClient,
  apiClientWithoutHeaders,
} from "@ryogo-travel-app/api/client/apiClient"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"

export function AddAgentConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddAgentFormDataType
  status: UserStatusEnum
  ownerId: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Confirm")
  const router = useRouter()

  const formData = useForm<AddAgentFormDataType>()
  //Submit actions
  const onSubmit = async () => {
    // Add agent
    const newAgentData: OnboardingAddAgentAPIRequestType = {
      agencyId: props.finalData.agencyId,
      data: {
        name: props.finalData.name,
        email: props.finalData.email,
        phone: props.finalData.phone,
      },
    }
    const addedAgent = await apiClient<OnboardingAddAgentAPIResponseType>(
      "/api/onboarding/add-agent",
      { method: "POST", body: JSON.stringify(newAgentData) },
    )
    if (addedAgent.id) {
      //If success, Try to upload user photo and driver user photo
      if (props.finalData.agentPhotos) {
        const formData = new FormData()
        formData.append("file", props.finalData.agentPhotos[0]!)
        await apiClientWithoutHeaders(
          `/api/onboarding/upload-user-photo/${addedAgent.id}`,
          {
            method: "POST",
            body: formData,
          },
        )
      }
      if (props.status == UserStatusEnum.NEW) {
        //If the owner is still new somehow, change to active
        await apiClientWithoutHeaders<OnboardingSetActiveAPIResponseType>(
          `/api/onboarding/set-active/${props.ownerId}`,
          {
            method: "POST",
          },
        )
      }
      props.onNext()
    } else {
      //Take back to agent onboarding page and show error
      toast.error(t("APIError"))
      router.replace("/dashboard")
    }
  }
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
            {formData.formState.isSubmitting && <Spinner />}
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
  )
}
