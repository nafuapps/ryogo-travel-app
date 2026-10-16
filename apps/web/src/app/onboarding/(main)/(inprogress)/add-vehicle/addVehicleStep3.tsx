"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  RyogoDatePicker,
  RyogoFileInput,
} from "@/components/form/ryogoFormFields"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"

export function AddVehicleStep3({
  onNext,
  onPrev,
  finalData,
  updateFinalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: AddVehicleRequestType
  updateFinalData: Dispatch<SetStateAction<AddVehicleRequestType>>
}) {
  const t = useTranslations("Onboarding.AddVehiclePage.Step3")
  const step3Schema = z.object({
    insuranceExpiresOn: z
      .date(t("Field1.Error1"))
      .min(new Date(), t("Field1.Error2"))
      .nonoptional(t("Field1.Error1")),
    insurancePhotos: FileRegex.refine((file) => {
      return file.length >= 1
    }, t("Field2.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return checkImageFileSize(file)
      }, t("Field2.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return checkImageFileType(file)
      }, t("Field2.Error3")),
    pucExpiresOn: z
      .date(t("Field3.Error1"))
      .min(new Date(), t("Field3.Error2"))
      .nonoptional(t("Field3.Error1")),
    pucPhotos: FileRegex.refine((file) => {
      return file.length >= 1
    }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return checkImageFileSize(file)
      }, t("Field4.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return checkImageFileType(file)
      }, t("Field4.Error3")),
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      insuranceExpiresOn: finalData.insuranceExpiresOn,
      insurancePhotos: finalData.insurancePhotos,
      pucExpiresOn: finalData.pucExpiresOn,
      pucPhotos: finalData.pucPhotos,
    },
  })

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    updateFinalData({
      ...finalData,
      insuranceExpiresOn: data.insuranceExpiresOn,
      insurancePhotos: data.insurancePhotos,
      pucExpiresOn: data.pucExpiresOn,
      pucPhotos: data.pucPhotos,
    })
    onNext()
  }

  return (
    <FormWrapper<Step3Type>
      id="Step3Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoDatePicker
          name="insuranceExpiresOn"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoFileInput
          name={"insurancePhotos"}
          register={formData.register("insurancePhotos")}
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <RyogoDatePicker
          name="pucExpiresOn"
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
          description={t("Field3.Description")}
        />
        <RyogoFileInput
          name={"pucPhotos"}
          register={formData.register("pucPhotos")}
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
        <RyogoOutlineButton
          size={"lg"}
          type="button"
          onClick={onPrev}
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
