"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  RyogoInput,
  RyogoFileInput,
  RyogoDatePicker,
} from "@/components/form/ryogoFormFields"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_FILE_UPLOAD_SIZE,
  MAX_ODOMETER_LIMIT,
  MAX_VEHICLE_CAPCITY,
  MIN_ODOMETER_LIMIT,
  MIN_VEHICLE_CAPCITY,
} from "@/lib/uiConfig"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"

export function AddVehicleStep2({
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
  const t = useTranslations("Onboarding.AddVehiclePage.Step2")

  const step2Schema = z.object({
    capacity: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(MIN_VEHICLE_CAPCITY, t("Field1.Error2"))
      .max(MAX_VEHICLE_CAPCITY, t("Field1.Error3"))
      .multipleOf(1, t("Field1.Error4"))
      .nonnegative(t("Field1.Error5")),
    odometerReading: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(MIN_ODOMETER_LIMIT, t("Field2.Error2"))
      .max(MAX_ODOMETER_LIMIT, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .nonnegative(t("Field2.Error5")),
    rcPhotos: FileRegex.refine((file) => {
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
    vehiclePhotos: FileRegex.refine((file) => {
      return file.length >= 1
    }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
      }, t("Field4.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field4.Error3")),
    rcExpiresOn: z
      .date(t("Field5.Error1"))
      .min(new Date(), t("Field5.Error2"))
      .nonoptional(t("Field5.Error1")),
  })
  type Step2Type = z.infer<typeof step2Schema>
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      capacity: finalData.data.capacity,
      odometerReading: finalData.data.odometerReading,
      rcPhotos: finalData.data.rcPhotos,
      vehiclePhotos: finalData.data.vehiclePhotos,
      rcExpiresOn: finalData.data.rcExpiresOn,
    },
  })

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    updateFinalData({
      ...finalData,
      data: {
        ...finalData.data,
        capacity: data.capacity,
        odometerReading: data.odometerReading,
        rcPhotos: data.rcPhotos,
        vehiclePhotos: data.vehiclePhotos,
        rcExpiresOn: data.rcExpiresOn,
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
          name={"capacity"}
          type="tel"
          label={t("Field1.Title")}
          placeholder={t("Field1.Placeholder")}
          description={t("Field1.Description")}
        />
        <RyogoInput
          name={"odometerReading"}
          type="tel"
          label={t("Field2.Title")}
          placeholder={t("Field2.Placeholder")}
          description={t("Field2.Description")}
        />
        <RyogoFileInput
          name={"rcPhotos"}
          register={formData.register("rcPhotos")}
          label={t("Field3.Title")}
          placeholder={t("Field3.Placeholder")}
          description={t("Field3.Description")}
        />
        <RyogoFileInput
          name={"vehiclePhotos"}
          register={formData.register("vehiclePhotos")}
          label={t("Field4.Title")}
          placeholder={t("Field4.Placeholder")}
          description={t("Field4.Description")}
        />
        <RyogoDatePicker
          name="rcExpiresOn"
          label={t("Field5.Title")}
          placeholder={t("Field5.Placeholder")}
          description={t("Field5.Description")}
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
