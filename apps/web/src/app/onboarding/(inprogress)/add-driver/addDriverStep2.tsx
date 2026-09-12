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
  MAX_FILE_UPLOAD_SIZE,
  MAX_LICENSE_LENGTH,
  MIN_LICENSE_LENGTH,
} from "@/lib/uiConfig"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

export function AddDriverStep2({
  onNext,
  onPrev,
  finalData,
  updateFinalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: AddDriverRequestType
  updateFinalData: Dispatch<SetStateAction<AddDriverRequestType>>
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Step2")
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
      licenseNumber: finalData.data.licenseNumber,
      licenseExpiresOn: finalData.data.licenseExpiresOn,
      licensePhotos: finalData.data.licensePhotos,
    },
  })

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    updateFinalData({
      ...finalData,
      data: {
        ...finalData.data,
        licenseNumber: data.licenseNumber,
        licenseExpiresOn: data.licenseExpiresOn,
        licensePhotos: data.licensePhotos,
      },
    })
    onNext()
  }

  return (
    <FormWrapper<Step2Type>
      id="Step2Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
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
          className="w-full"
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
          className="w-full"
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
