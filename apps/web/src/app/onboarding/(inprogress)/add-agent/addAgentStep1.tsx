"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoFileInput, RyogoInput } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { FileRegex } from "@/lib/regex"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export function AddAgentStep1({
  onNext,
  finalData,
  updateFinalData,
  allAgents,
}: {
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
    agentPhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < 1000000
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
          ].includes(file[0].type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      agentName: finalData.data.name,
      agentPhone: finalData.data.phone,
      agentEmail: finalData.data.email,
      agentPhotos: finalData.data.photos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    if (
      allAgents.some(
        (a) => a.email === data.agentEmail && a.phone === data.agentPhone,
      )
    ) {
      //If agent with same phone and email exists in system already, show error
      formData.setError("agentPhone", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      //If no errors, move ahead
      updateFinalData({
        agencyId: finalData.agencyId,
        data: {
          ...finalData.data,
          name: data.agentName,
          phone: data.agentPhone,
          email: data.agentEmail,
          photos: data.agentPhotos,
        },
      })
      onNext()
    }
  }

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step1Content">
          <RyogoInput
            name={"agentName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoInput
            name={"agentPhone"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <RyogoInput
            name={"agentEmail"}
            type="email"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <RyogoFileInput
            name={"agenctPhotos"}
            register={formData.register("agentPhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <RyogoDefaultButton
            className="w-full"
            type="submit"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
