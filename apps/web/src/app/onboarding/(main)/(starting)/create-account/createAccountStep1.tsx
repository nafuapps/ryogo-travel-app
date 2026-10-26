"use client"

import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { RyogoInput, RyogoOTPInput } from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { useBotDetection } from "@/hooks/useBotDetection"
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

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
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    ownerName: z
      .string()
      .min(MIN_NAME_LENGTH, t("Field2.Error1"))
      .max(MAX_NAME_LENGTH, t("Field2.Error2")),
    ownerPhone: z.string().length(PHONE_LENGTH, t("Field3.Error1")),
    ownerEmail: z
      .email(t("Field4.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field4.Error2")),
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
  const onSubmit = async (values: Step1Type) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    if (
      allOwners.some(
        (o) => o.email === values.ownerEmail && o.phone === values.ownerPhone,
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
          businessName: values.agencyName,
        },
        owner: {
          ...finalData.owner,
          name: values.ownerName,
          phone: values.ownerPhone,
          email: values.ownerEmail,
        },
      })
      onNext()
    }
  }

  return (
    <FormWrapper<Step1Type>
      id="Step1Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
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
        <RyogoOTPInput
          length={10}
          name={"ownerPhone"}
          label={t("Field3.Title")}
          description={t("Field3.Description")}
        />
        <RyogoInput
          name={"ownerEmail"}
          type="email"
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
          description={t("Field4.Description")}
        />
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={formData.formState.isSubmitting || isBot}
          showSpinner={formData.formState.isSubmitting}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
