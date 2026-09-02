"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useBotDetection } from "@/hooks/useBotDetection"
import { toast } from "sonner"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export function CreateAccountStep1({
  onNext,
  finalData,
  updateFinalData,
  allOwners,
}: {
  onNext: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
  allOwners: FindAllUsersByRoleType
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Step1")
  const { checkBotActivity, isBot } = useBotDetection()

  const step1Schema = z.object({
    agencyName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    ownerName: z
      .string()
      .min(5, t("Field2.Error1"))
      .max(30, t("Field2.Error2")),
    ownerPhone: z.string().length(10, t("Field3.Error1")),
    ownerEmail: z.email(t("Field4.Error1")).max(60, t("Field4.Error2")),
  })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      agencyName: finalData.agency.businessName,
      ownerName: finalData.owner.name,
      ownerPhone: finalData.owner.phone,
      ownerEmail: finalData.owner.email,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    if (
      allOwners.some(
        (o) => o.email === data.ownerEmail && o.phone === data.ownerPhone,
      )
    ) {
      formData.setError("ownerPhone", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      updateFinalData({
        agency: {
          ...finalData.agency,
          businessName: data.agencyName,
        },
        owner: {
          ...finalData.owner,
          name: data.ownerName,
          phone: data.ownerPhone,
          email: data.ownerEmail,
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
            name={"agencyName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoInput
            name={"ownerName"}
            type="text"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <RyogoInput
            name={"ownerPhone"}
            type="tel"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <RyogoInput
            name={"ownerEmail"}
            type="email"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <RyogoDefaultButton
            className="w-full"
            type="submit"
            disabled={formData.formState.isSubmitting || isBot}
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
