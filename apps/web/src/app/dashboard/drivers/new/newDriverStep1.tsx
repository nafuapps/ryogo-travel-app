"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Dispatch, SetStateAction } from "react"
import { RyogoFileInput, RyogoInput } from "@/components/form/ryogoFormFields"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
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
  SectionRowWrapper,
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"

export function NewDriverStep1({
  onNext,
  newDriverFormData,
  setNewDriverFormData,
  agencyId,
  userId,
  allDrivers,
}: {
  onNext: () => void
  newDriverFormData: AddDriverRequestType
  setNewDriverFormData: Dispatch<SetStateAction<AddDriverRequestType>>
  agencyId: string
  userId: string
  allDrivers: FindAllUsersByRoleType
}) {
  const t = useTranslations("Dashboard.NewDriver.Step1")

  const step1Schema = z
    .object({
      driverName: z
        .string()
        .min(MIN_NAME_LENGTH, t("Field1.Error1"))
        .max(MAX_NAME_LENGTH, t("Field1.Error2")),
      driverPhone: z
        .string()
        .length(PHONE_LENGTH, t("Field2.Error1"))
        .refine((value) => {
          // Check if a driver with same phone exists in this agency
          return !allDrivers.some(
            (u) => u.phone === value && u.agencyId === agencyId,
          )
        }, t("APIError1")),
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
          message: t("APIError2"),
          path: ["driverEmail"],
        })
      }
    })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: newDriverFormData.data.name,
      driverPhone: newDriverFormData.data.phone,
      driverEmail: newDriverFormData.data.email,
      driverPhotos: newDriverFormData.data.userPhotos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    setNewDriverFormData({
      ...newDriverFormData,
      data: {
        ...newDriverFormData.data,
        name: data.driverName,
        phone: data.driverPhone,
        email: data.driverEmail,
        userPhotos: data.driverPhotos,
      },
    })
    onNext()
  }

  return (
    <PageWrapper id="NewDriverStep1">
      <FormWrapper<Step1Type>
        id="Step1Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <SectionRowWrapper end>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </SectionRowWrapper>
        <StepsTracker steps={"driver"} current={0} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
        <FormContentWrapper>
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
        <StickyActionWrapper>
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
            agencyId={agencyId}
            addedByUserId={userId}
            disabled={
              !formData.formState.isValid || formData.formState.isSubmitting
            }
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
