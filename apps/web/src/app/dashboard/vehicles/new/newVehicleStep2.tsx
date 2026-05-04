"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  RyogoDatePicker,
  RyogoFileInput,
  RyogoInput,
} from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import { H4, CaptionGrey, SmallGrey } from "@/components/typography"
import StepsTracker from "@/components/form/stepsTracker"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import {
  NewFormActionWrapper,
  NewFormContentWrapper,
  NewFormWrapper,
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"

export function NewVehicleStep2(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: AddVehicleRequestType
  setNewVehicleFormData: Dispatch<SetStateAction<AddVehicleRequestType>>
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step2")

  const step2Schema = z.object({
    capacity: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(0, t("Field1.Error2"))
      .max(100, t("Field1.Error3"))
      .multipleOf(1, t("Field1.Error4"))
      .nonnegative(t("Field1.Error5")),
    odometerReading: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(0, t("Field2.Error2"))
      .max(1000000, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .nonnegative(t("Field2.Error5")),
    rcPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1
      }, t("Field3.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0] && file[0].size < 1000000
      }, t("Field3.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field3.Error3")),
    vehiclePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0] && file[0].size < 1000000
      }, t("Field4.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
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
      capacity: props.newVehicleFormData.data.capacity,
      odometerReading: props.newVehicleFormData.data.odometerReading,
      rcPhotos: props.newVehicleFormData.data.rcPhotos,
      vehiclePhotos: props.newVehicleFormData.data.vehiclePhotos,
      rcExpiresOn: props.newVehicleFormData.data.rcExpiresOn,
    },
  })

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    props.setNewVehicleFormData({
      agencyId: props.newVehicleFormData.agencyId,
      data: {
        ...props.newVehicleFormData.data,
        capacity: data.capacity,
        odometerReading: data.odometerReading,
        rcPhotos: data.rcPhotos,
        vehiclePhotos: data.vehiclePhotos,
        rcExpiresOn: data.rcExpiresOn,
      },
    })
    props.onNext()
  }
  return (
    <NewStepWrapper id="NewVehicleStep2">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </NewStepTitleWrapper>
        <StepsTracker total={5} current={1} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step2Type>
        id="Step2Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
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
            name={"vehiclePhotos"}
            register={formData.register("vehiclePhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
        </NewFormContentWrapper>
        <NewFormContentWrapper>
          <RyogoFileInput
            name={"rcPhotos"}
            register={formData.register("rcPhotos")}
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <RyogoDatePicker
            name="rcExpiresOn"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
          />
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </Button>
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
