"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { RyogoH3 } from "@/components/typography"
import ConfirmValues from "@/components/form/confirmValues"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { addAgentAction } from "@/app/actions/users/addAgentAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export function AddAgentConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddAgentRequestType
  ownerId: string
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Confirm")
  const router = useRouter()

  const formData = useForm<AddAgentRequestType>()
  //Submit actions
  const onSubmit = async () => {
    // Add agent
    const newAgentData: AddAgentRequestType = {
      agencyId: props.finalData.agencyId,
      data: {
        name: props.finalData.data.name,
        email: props.finalData.data.email,
        phone: props.finalData.data.phone,
        photos: props.finalData.data.photos,
      },
    }
    const addAgent = await addAgentAction(newAgentData)
    if (addAgent) {
      props.onNext()
    } else {
      //Take to dashboard page and show error
      toast.error(t("APIError"))
      router.replace("/dashboard/home")
    }
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step2Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step2Content">
          <RyogoH3 color="slate">{t("Title")}</RyogoH3>
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
          <RyogoDefaultButton
            className="w-full"
            type="submit"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            className="w-full"
            disabled={formData.formState.isSubmitting}
            label={t("SecondaryCTA")}
          />
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
