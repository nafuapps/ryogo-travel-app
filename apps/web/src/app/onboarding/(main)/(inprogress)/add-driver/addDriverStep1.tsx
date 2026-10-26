"use client"

import QuickAddDriverAlertButton from "@/components/buttons/alert/quickAddDriverAlertButton"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  RyogoFileInput,
  RyogoInput,
  RyogoOTPInput,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import compressImage from "@/lib/imageCompression"
import { FileRegex } from "@/lib/regex"
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

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
        return checkImageFileSize(file)
      }, t("Field4.Error1"))
        .refine((file) => {
          if (file.length < 1) return true
          return checkImageFileType(file)
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
      driverName: finalData.name,
      driverPhone: finalData.phone,
      driverEmail: finalData.email,
    },
  })

  //Submit actions
  const onSubmit = async (values: Step1Type) => {
    updateFinalData({
      ...finalData,
      name: values.driverName,
      phone: values.driverPhone,
      email: values.driverEmail,
      userPhotos:
        (await compressImage(values.driverPhotos)) ?? finalData.userPhotos,
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
        <RyogoOTPInput
          length={10}
          name={"driverPhone"}
          label={t("Field2.Title")}
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
          existingFile={finalData.userPhotos}
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
