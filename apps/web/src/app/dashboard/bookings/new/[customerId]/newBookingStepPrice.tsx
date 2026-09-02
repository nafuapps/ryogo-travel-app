"use client"

import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import StepsTracker from "@/components/form/stepsTracker"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import NewBookingTripCard from "@/components/flows/bookings/new/newBookingTripCard"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function NewBookingStepPrice({
  onNext,
  onPrev,
  newBookingFormData,
  setNewBookingFormData,
}: {
  onNext: () => void
  onPrev: () => void
  newBookingFormData: NewBookingRequestDataType
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingRequestDataType>
  >
}) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form.StepPrice")

  const stepPriceSchema = z.object({
    //Cost
    selectedRatePerKm: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(1, t("Field1.Error2"))
      .max(100, t("Field1.Error3"))
      .positive(t("Field1.Error4"))
      .multipleOf(1, t("Field1.Error5"))
      .nonoptional(),
    selectedAllowancePerDay: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(0, t("Field2.Error2"))
      .max(10000, t("Field2.Error3"))
      .nonnegative(t("Field2.Error4"))
      .multipleOf(1, t("Field2.Error5"))
      .nonoptional(),
    selectedAcChargePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(0, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .nonnegative(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5"))
      .optional(),
    selectedCommissionRate: z.coerce
      .number<number>(t("Field4.Error1"))
      .min(0, t("Field4.Error2"))
      .max(100, t("Field4.Error3"))
      .nonnegative(t("Field4.Error4"))
      .multipleOf(1, t("Field4.Error5"))
      .nonoptional(),
    selectedDistance: z.coerce
      .number<number>(t("Field5.Error1"))
      .min(1, t("Field5.Error2"))
      .max(5000, t("Field5.Error3"))
      .positive(t("Field5.Error4"))
      .multipleOf(1, t("Field5.Error5"))
      .nonoptional(),
  })

  type StepPriceType = z.infer<typeof stepPriceSchema>

  //Form init
  const form = useForm<StepPriceType>({
    resolver: zodResolver(stepPriceSchema),
    defaultValues: {
      selectedRatePerKm: newBookingFormData.selectedRatePerKm,
      selectedAllowancePerDay: newBookingFormData.selectedAllowancePerDay,
      selectedAcChargePerDay: newBookingFormData.selectedAcChargePerDay,
      selectedCommissionRate: newBookingFormData.selectedCommissionRate,
      selectedDistance: newBookingFormData.selectedDistance,
    },
  })

  //Form submit
  function onSubmit(values: StepPriceType) {
    setNewBookingFormData({
      ...newBookingFormData,
      selectedRatePerKm: values.selectedRatePerKm,
      selectedAllowancePerDay: values.selectedAllowancePerDay,
      selectedAcChargePerDay:
        values.selectedAcChargePerDay ??
        newBookingFormData.selectedAcChargePerDay,
      selectedCommissionRate: values.selectedCommissionRate,
      selectedDistance: values.selectedDistance,
    })
    onNext()
  }

  return (
    <NewStepWrapper id="CostStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">
            {t("Subtitle", { current: 4, total: 5 })}
          </RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"booking"} current={3} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      <NewFormWrapper<StepPriceType>
        id="StepPriceForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewBookingTripCard {...newBookingFormData} />
        <NewFormContentWrapper>
          <RyogoInput
            name="selectedDistance"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
            type="tel"
            disabled={newBookingFormData.routeId ? true : false}
          />
          <RyogoInput
            name="selectedRatePerKm"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
            type="tel"
          />
          <RyogoInput
            name="selectedAllowancePerDay"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
            type="tel"
          />
          <RyogoInput
            name="selectedAcChargePerDay"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
            type="tel"
            disabled={newBookingFormData.tripNeedsAC === false}
          />
          <RyogoInput
            name="selectedCommissionRate"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
            type="tel"
          />
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
            onClick={onPrev}
            disabled={form.formState.isSubmitting}
            label={t("Back")}
          />
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
