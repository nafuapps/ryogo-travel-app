"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Dispatch, SetStateAction } from "react"
import {
  RyogoFileInput,
  RyogoInput,
  RyogoOTPInput,
} from "@/components/form/ryogoFormFields"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import QuickAddDriverAlertButton from "@/components/buttons/alert/quickAddDriverAlertButton"
import { FileRegex } from "@/lib/regex"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  AddDriverTotalSteps,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  PHONE_LENGTH,
} from "@/lib/uiConfig"
import {
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"
import FormStepHeader from "@/components/form/formStepHeader"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"

export function NewDriverStep1({
  onNext,
  newDriverFormData,
  setNewDriverFormData,
  agencyId,
  userId,
  allDrivers,
  agencyName,
}: {
  onNext: () => void
  newDriverFormData: AddDriverRequestType
  setNewDriverFormData: Dispatch<SetStateAction<AddDriverRequestType>>
  agencyId: string
  userId: string
  allDrivers: FindAllUsersByRoleType
  agencyName?: string
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
          message: t("APIError2"),
          path: ["driverEmail"],
        })
      }
    })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: newDriverFormData.name,
      driverPhone: newDriverFormData.phone,
      driverEmail: newDriverFormData.email,
      driverPhotos: newDriverFormData.userPhotos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    setNewDriverFormData({
      ...newDriverFormData,
      name: data.driverName,
      phone: data.driverPhone,
      email: data.driverEmail,
      userPhotos: data.driverPhotos,
    })
    onNext()
  }

  return (
    <PageWrapper id="NewDriverStep1">
      <FormStepHeader
        totalSteps={AddDriverTotalSteps}
        currentStepIndex={0}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: 1,
          total: AddDriverTotalSteps,
        })}
        description={t("Description")}
        href={"/dashboard/support/help-drivers#adding"}
      />
      <FormWrapper<Step1Type>
        id="Step1Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
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
            agencyName={agencyName}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
