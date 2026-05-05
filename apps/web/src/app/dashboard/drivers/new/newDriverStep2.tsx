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
import StepsTracker, {
  NewDriverTotalSteps,
} from "@/components/form/stepsTracker"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"
import {
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"

export function NewDriverStep2(props: {
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
      .min(12, t("Field1.Error1"))
      .max(20, t("Field1.Error2")),
    licenseExpiresOn: z
      .date(t("Field2.Error1"))
      .min(new Date(), t("Field2.Error2"))
      .nonoptional(t("Field2.Error1")),
    licensePhotos: z
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
  })
  type Step2Type = z.infer<typeof step2Schema>
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      licenseNumber: props.newDriverFormData.data.licenseNumber,
      licenseExpiresOn: props.newDriverFormData.data.licenseExpiresOn,
      licensePhotos: props.newDriverFormData.data.licensePhotos,
    },
  })

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    props.setNewDriverFormData({
      agencyId: props.newDriverFormData.agencyId,
      data: {
        ...props.newDriverFormData.data,
        licenseNumber: data.licenseNumber,
        licenseExpiresOn: data.licenseExpiresOn,
        licensePhotos: data.licensePhotos,
      },
    })
    props.onNext()
  }

  return (
    <NewStepWrapper id="NewDriverStep2">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </NewStepTitleWrapper>
        <StepsTracker total={NewDriverTotalSteps} current={1} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step2Type>
        id="Step2Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
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
