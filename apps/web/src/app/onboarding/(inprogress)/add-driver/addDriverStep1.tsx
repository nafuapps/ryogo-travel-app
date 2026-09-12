"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { RyogoFileInput, RyogoInput } from "@/components/form/ryogoFormFields"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import QuickAddDriverAlertButton from "@/components/buttons/alert/quickAddDriverAlertButton"
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

export function AddDriverStep1({
  onNext,
  finalData,
  updateFinalData,
  allDrivers,
}: {
  onNext: () => void
  finalData: AddDriverRequestType
  updateFinalData: Dispatch<SetStateAction<AddDriverRequestType>>
  allDrivers: FindAllUsersByRoleType
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step1")

  const step1Schema = z
    .object({
      driverName: z
        .string()
        .min(MIN_NAME_LENGTH, t("Field1.Error1"))
        .max(MAX_NAME_LENGTH, t("Field1.Error2")),
      driverPhone: z.string().length(PHONE_LENGTH, t("Field2.Error1")),
      driverEmail: z
        .email(t("Field3.Error1"))
        .max(MAX_EMAIL_LENGTH, t("Field3.Error2")),
      driverPhotos: FileRegex.refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
      }, t("Field4.Error1"))
        .refine((file) => {
          if (file.length < 1) return true
          return file[0] && SupportedImageFormats.includes(file[0].type)
        }, t("Field4.Error2"))
        .optional(),
    })
    .superRefine((data, ctx) => {
      // Check if a driver with same phone and email exists in entire DB
      if (
        allDrivers.some(
          (u) => u.phone === data.driverPhone && u.email === data.driverEmail,
        )
      ) {
        ctx.addIssue({
          code: "custom",
          message: t("APIError"),
          path: ["driverEmail"],
        })
      }
    })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: finalData.data.name,
      driverPhone: finalData.data.phone,
      driverEmail: finalData.data.email,
      driverPhotos: finalData.data.userPhotos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    updateFinalData({
      ...finalData,
      data: {
        ...finalData.data,
        name: data.driverName,
        phone: data.driverPhone,
        email: data.driverEmail,
        userPhotos: data.driverPhotos,
      },
    })
    onNext()
  }

  return (
    <FormWrapper<Step1Type>
      id="Step1Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoInput
          name={"driverName"}
          type="text"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoInput
          name={"driverPhone"}
          type="tel"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <RyogoInput
          name={"driverEmail"}
          type="email"
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
          description={t("Field3.Description")}
        />
        <RyogoFileInput
          name={"driverPhotos"}
          register={formData.register("driverPhotos")}
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
        <QuickAddDriverAlertButton
          name={formData.getValues("driverName")}
          email={formData.getValues("driverEmail")}
          phone={formData.getValues("driverPhone")}
          photo={formData.getValues("driverPhotos")}
          agencyId={finalData.agencyId}
          addedByUserId={finalData.addedByUserId}
          disabled={
            !formData.formState.isValid || formData.formState.isSubmitting
          }
          isOnboarding
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
