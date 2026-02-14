import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
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
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { addAgentAction } from "@/app/actions/users/addAgentAction"
import { useTransition } from "react"

export function AddAgentConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddAgentRequestType
  status: UserStatusEnum
  ownerId: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Confirm")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const formData = useForm<AddAgentRequestType>()
  //Submit actions
  const onSubmit = async () => {
    startTransition(async () => {
      // Add agent
      const newAgentData: AddAgentRequestType = {
        agencyId: props.finalData.agencyId,
        ownerId:
          props.status === UserStatusEnum.NEW ? props.ownerId : undefined,
        data: {
          name: props.finalData.data.name,
          email: props.finalData.data.email,
          phone: props.finalData.data.phone,
          photos: props.finalData.data.photos,
        },
      }
      if (await addAgentAction(newAgentData)) {
        props.onNext()
      } else {
        //Take back to agent onboarding page and show error
        toast.error(t("APIError"))
        router.replace("/dashboard")
      }
    })
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step2Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step2Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues
            name={t("AgentName")}
            value={props.finalData.data.name}
          />
          <ConfirmValues
            name={t("AgentPhone")}
            value={props.finalData.data.phone}
          />
          <ConfirmValues
            name={t("AgentEmail")}
            value={props.finalData.data.email}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step2Actions">
          <OnboardingStepPrimaryAction disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={props.onPrev}
            disabled={isPending}
          >
            {t("SecondaryCTA")}
          </OnboardingStepSecondaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
