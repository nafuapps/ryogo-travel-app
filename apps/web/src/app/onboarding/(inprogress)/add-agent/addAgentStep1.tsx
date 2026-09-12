"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoFileInput, RyogoInput } from "@/components/form/ryogoFormFields"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  MAX_EMAIL_LENGTH,
  MAX_FILE_UPLOAD_SIZE,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

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
      .min(MIN_NAME_LENGTH, t("Field1.Error1"))
      .max(MAX_NAME_LENGTH, t("Field1.Error2")),
    agentPhone: z.string().length(PHONE_LENGTH, t("Field2.Error1")),
    agentEmail: z
      .email(t("Field3.Error1"))
      .max(MAX_EMAIL_LENGTH, t("Field3.Error2")),
    agentPhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
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
    <FormWrapper<Step1Type>
      id="Step1Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
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
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
