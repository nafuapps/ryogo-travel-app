"use client"

import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { DriverIdRegex } from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import StepsTracker from "@/components/form/stepsTracker"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import AssignDriverTile from "@/components/flows/bookings/assign/assignDriverTile"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
  NewStepGridWrapper,
} from "@/components/form/newFormWrappers"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import { NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY } from "@/lib/uiConfig"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"

export default function NewBookingStepDriver({
  onNext,
  onPrev,
  newBookingFormData,
  setNewBookingFormData,
  drivers,
  limited,
  isSubscribed,
  hasTriedSubscription,
}: {
  onNext: () => void
  onPrev: () => void
  newBookingFormData: NewBookingRequestDataType
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingRequestDataType>
  >
  drivers: FindDriversByAgencyType
  limited: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form.StepDriver")

  const stepDriverSchema = z.object({
    assignedDriverId: DriverIdRegex.optional(),
  })

  type StepDriverType = z.infer<typeof stepDriverSchema>

  //Form init
  const form = useForm<StepDriverType>({
    resolver: zodResolver(stepDriverSchema),
    defaultValues: {
      assignedDriverId: newBookingFormData.assignedDriverId,
    },
  })

  //Save selected driver
  function onSelectDriver(selectedDriverId?: string) {
    form.setValue("assignedDriverId", selectedDriverId)
    const selectedDriver = drivers.find(
      (driver) => driver.id === selectedDriverId,
    )
    setNewBookingFormData({
      ...newBookingFormData,
      assignedDriverId: selectedDriverId,
      selectedAllowancePerDay: selectedDriver
        ? selectedDriver.defaultAllowancePerDay
        : NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY,
    })
  }

  function onSubmit() {
    onNext()
  }

  const assignedDriverId = useWatch({
    name: "assignedDriverId",
    control: form.control,
  })

  return (
    <NewStepWrapper id="AssignmentStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">
            {t("Subtitle", { current: 3, total: 5 })}
          </RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"booking"} current={2} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      {limited && (
        <SubscriptionReminderButton
          warningText={isSubscribed ? t("ExpiredWarning") : t("TrialWarning")}
          ctaText={
            isSubscribed
              ? t("RenewCTA")
              : hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
          }
        />
      )}
      <NewFormWrapper<StepDriverType>
        id="StepDriverForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <NewStepGridWrapper>
            {drivers.map((driver, index) => (
              <AssignDriverTile
                key={index}
                driverData={driver}
                bookingStartDate={newBookingFormData.tripStartDate}
                bookingEndDate={newBookingFormData.tripEndDate}
                bookingPassengers={newBookingFormData.tripPassengers}
                selected={assignedDriverId === driver.id}
                onClick={() =>
                  onSelectDriver(
                    assignedDriverId === driver.id ? undefined : driver.id,
                  )
                }
              />
            ))}
          </NewStepGridWrapper>
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            label={
              form.formState.isSubmitting
                ? t("Loading")
                : assignedDriverId
                  ? t("PrimaryCTA")
                  : t("WithoutCTA")
            }
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
