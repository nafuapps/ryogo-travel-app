"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Dispatch, SetStateAction } from "react"
import { RyogoFileInput, RyogoInput } from "@/components/form/ryogoFormFields"
import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import StepsTracker, {
  NewDriverTotalSteps,
} from "@/components/form/stepsTracker"
import { Button } from "@/components/ui/button"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
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

export function NewDriverStep1(props: {
  onNext: () => void
  newDriverFormData: AddDriverRequestType
  setNewDriverFormData: Dispatch<SetStateAction<AddDriverRequestType>>
  agencyId: string
  allDrivers: FindAllUsersByRoleType
}) {
  const t = useTranslations("Dashboard.NewDriver.Step1")

  const step1Schema = z.object({
    driverName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    driverPhone: z.string().length(10, t("Field2.Error1")),
    driverEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    driverPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < 1000000
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
          ].includes(file[0].type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: props.newDriverFormData.data.name,
      driverPhone: props.newDriverFormData.data.phone,
      driverEmail: props.newDriverFormData.data.email,
      driverPhotos: props.newDriverFormData.data.userPhotos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    if (
      props.allDrivers.some(
        (u) => u.phone === data.driverPhone && u.agencyId === props.agencyId,
      )
    ) {
      // Check if a driver with same phone exists in this agency
      formData.setError("driverPhone", {
        type: "manual",
        message: t("APIError1"),
      })
    } else if (
      props.allDrivers.some(
        (u) => u.phone === data.driverPhone && u.email === data.driverEmail,
      )
    ) {
      // Check if a driver with same phone and email exists in entire DB
      formData.setError("driverPhone", {
        type: "manual",
        message: t("APIError2"),
      })
    } else {
      props.setNewDriverFormData({
        agencyId: props.newDriverFormData.agencyId,
        data: {
          ...props.newDriverFormData.data,
          name: data.driverName,
          phone: data.driverPhone,
          email: data.driverEmail,
          userPhotos: data.driverPhotos,
        },
      })
      props.onNext()
    }
  }

  return (
    <NewStepWrapper id="NewDriverStep1">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </NewStepTitleWrapper>
        <StepsTracker total={NewDriverTotalSteps} current={0} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step1Type>
        id="Step1Form"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
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
            name={"agenctPhotos"}
            register={formData.register("driverPhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
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
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
