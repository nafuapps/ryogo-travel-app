"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  RyogoDatePicker,
  RyogoFileInput,
  RyogoInput,
} from "@/components/form/ryogoFormFields"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  AddDriverTotalSteps,
  MAX_FILE_UPLOAD_SIZE,
  MAX_LICENSE_LENGTH,
  MIN_LICENSE_LENGTH,
} from "@/lib/uiConfig"
import {
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"
import FormStepHeader from "@/components/form/formStepHeader"

export function NewDriverStep2({
  onNext,
  onPrev,
  newDriverFormData,
  setNewDriverFormData,
}: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: AddDriverRequestType
  setNewDriverFormData: Dispatch<SetStateAction<AddDriverRequestType>>
}) {
  const t = useTranslations("Dashboard.NewDriver.Step2")
  const step2Schema = z.object({
    licenseNumber: z
      .string()
      .trim()
      .min(MIN_LICENSE_LENGTH, t("Field1.Error1"))
      .max(MAX_LICENSE_LENGTH, t("Field1.Error2")),
    licenseExpiresOn: z
      .date(t("Field2.Error1"))
      .min(new Date(), t("Field2.Error2"))
      .nonoptional(t("Field2.Error1")),
    licensePhotos: FileRegex.refine((file) => {
      return file.length >= 1
    }, t("Field3.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
      }, t("Field3.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field3.Error3")),
  })
  type Step2Type = z.infer<typeof step2Schema>
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      licenseNumber: newDriverFormData.data.licenseNumber,
      licenseExpiresOn: newDriverFormData.data.licenseExpiresOn,
      licensePhotos: newDriverFormData.data.licensePhotos,
    },
  })

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    setNewDriverFormData({
      ...newDriverFormData,
      data: {
        ...newDriverFormData.data,
        licenseNumber: data.licenseNumber,
        licenseExpiresOn: data.licenseExpiresOn,
        licensePhotos: data.licensePhotos,
      },
    })
    onNext()
  }

  return (
    <PageWrapper id="NewDriverStep2">
      <FormStepHeader
        totalSteps={AddDriverTotalSteps}
        currentStepIndex={1}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: 2,
          total: AddDriverTotalSteps,
        })}
        description={t("Description")}
      />
      <FormWrapper<Step2Type>
        id="Step2Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <RyogoInput
            name={"licenseNumber"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoDatePicker
            name="licenseExpiresOn"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <RyogoFileInput
            name={"licensePhotos"}
            register={formData.register("licensePhotos")}
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
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
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={onPrev}
            disabled={formData.formState.isSubmitting}
            label={t("SecondaryCTA")}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
