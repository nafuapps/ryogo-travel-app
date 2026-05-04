"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { RyogoInput, RyogoSwitch } from "@/components/form/ryogoFormFields"
import { H4, CaptionGrey, SmallGrey } from "@/components/typography"
import {
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
  newBookingActionBlockClassName,
  newBookingFormBlockClassName,
} from "../../bookings/new/newBookingCommon"
import StepsTracker from "@/components/form/stepsTracker"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { NewStepWrapper } from "@/components/page/pageWrappers"

export function NewVehicleStep4(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: AddVehicleRequestType
  setNewVehicleFormData: Dispatch<SetStateAction<AddVehicleRequestType>>
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step4")
  const step4Schema = z.object({
    defaultRatePerKm: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(1, t("Field1.Error2"))
      .max(100, t("Field1.Error3"))
      .positive(t("Field1.Error4"))
      .multipleOf(1, t("Field1.Error5"))
      .optional(),
    hasAC: z.boolean(),
    defaultAcChargePerDay: z.coerce
      .number<number>()
      .min(0, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .nonnegative(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5"))
      .optional(),
  })
  type Step4Type = z.infer<typeof step4Schema>
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      defaultRatePerKm: props.newVehicleFormData.data.defaultRatePerKm,
      hasAC: props.newVehicleFormData.data.hasAC,
      defaultAcChargePerDay:
        props.newVehicleFormData.data.defaultAcChargePerDay,
    },
  })

  const acWatch = useWatch({
    name: "hasAC",
    control: formData.control,
  })

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    props.setNewVehicleFormData({
      agencyId: props.newVehicleFormData.agencyId,
      data: {
        ...props.newVehicleFormData.data,
        defaultRatePerKm: data.defaultRatePerKm,
        hasAC: data.hasAC,
        defaultAcChargePerDay: data.defaultAcChargePerDay,
      },
    })
    props.onNext()
  }

  return (
    <NewStepWrapper id="NewVehicleStep4">
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <StepsTracker total={5} current={3} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...formData}>
        <form
          id="Step4Form"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="Step4Fields" className={newBookingFormBlockClassName}>
            <RyogoInput
              name={"defaultRatePerKm"}
              type="tel"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <RyogoSwitch name={"hasAC"} label={t("Field2.Title")} />
            <RyogoInput
              name={"defaultAcChargePerDay"}
              type="tel"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
              disabled={!acWatch}
            />
          </div>
          <div id="FormActions" className={newBookingActionBlockClassName}>
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
          </div>
        </form>
      </Form>
    </NewStepWrapper>
  )
}
