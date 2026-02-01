import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  OnboardingFileInput,
  OnboardingInput,
} from "@/app/onboarding/components/onboardingFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"

export function AddAgentStep1(props: {
  onNext: () => void
  finalData: AddAgentRequestType
  updateFinalData: Dispatch<SetStateAction<AddAgentRequestType>>
  allAgents: FindAllUsersByRoleType
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Step1")
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
        if (file.length < 1) return true
        return file[0] && file[0]!.size < 1000000
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
          ].includes(file[0]!.type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      agentName: props.finalData.data.name,
      agentPhone: props.finalData.data.phone,
      agentEmail: props.finalData.data.email,
      agentPhotos: props.finalData.data.photos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    if (
      props.allAgents.some(
        (a) => a.email == data.agentEmail && a.phone == data.agentPhone,
      )
    ) {
      //If agent with same phone and email exists in system already, show error
      formData.setError("agentPhone", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      //If no errors, move ahead
      props.updateFinalData({
        agencyId: props.finalData.agencyId,
        data: {
          ...props.finalData.data,
          name: data.agentName,
          phone: data.agentPhone,
          email: data.agentEmail,
          photos: data.agentPhotos,
        },
      })
      props.onNext()
    }
  }

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
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
