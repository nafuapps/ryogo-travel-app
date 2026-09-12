"use client"

import { VehicleIdRegex } from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import AssignVehicleTile from "@/components/flows/bookings/assign/assignVehicleTile"
import { NewBookingRequestDataType } from "@ryogo-travel-app/api/types/booking.types"
import {
  NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
  NewBookingTotalSteps,
} from "@/lib/uiConfig"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"
import {
  TileGridWrapper,
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"
import FormStepHeader from "@/components/form/formStepHeader"

export default function NewBookingStepVehicle({
  onNext,
  onPrev,
  newBookingFormData,
  setNewBookingFormData,
  vehicles,
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
  vehicles: FindVehiclesByAgencyType
  limited: boolean
  isSubscribed: boolean
  hasTriedSubscription: boolean
}) {
  const t = useTranslations("Dashboard.NewBookingWithCustomer.Form.StepVehicle")

  const stepVehicleSchema = z.object({
    assignedVehicleId: VehicleIdRegex.optional(),
  })

  type StepVehicleType = z.infer<typeof stepVehicleSchema>

  //Form init
  const form = useForm<StepVehicleType>({
    resolver: zodResolver(stepVehicleSchema),
    defaultValues: {
      assignedVehicleId: newBookingFormData.assignedVehicleId,
    },
  })

  //Save selected vehicle
  function onSelectVehicle(selectedVehicleId: string | undefined) {
    form.setValue("assignedVehicleId", selectedVehicleId)
    const selectedVehicle = vehicles.find(
      (vehicle) => vehicle.id === selectedVehicleId,
    )
    setNewBookingFormData({
      ...newBookingFormData,
      assignedVehicleId: selectedVehicleId,
      selectedAcChargePerDay: selectedVehicle
        ? selectedVehicle.defaultAcChargePerDay
        : NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
      selectedRatePerKm: selectedVehicle
        ? selectedVehicle.defaultRatePerKm
        : NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
    })
  }

  function onSubmit() {
    onNext()
  }

  const assignedVehicleId = useWatch({
    name: "assignedVehicleId",
    control: form.control,
  })

  return (
    <PageWrapper id="AssignmentStep">
      <FormStepHeader
        totalSteps={NewBookingTotalSteps}
        currentStepIndex={1}
        title={t("Title")}
        stepLabel={t("Subtitle", {
          current: 2,
          total: NewBookingTotalSteps,
        })}
        description={t("Description")}
      />
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
      <FormWrapper<StepVehicleType>
        id="StepVehicleForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <TileGridWrapper>
            {vehicles
              .sort(
                (a, b) => a.assignedBookings.length - b.assignedBookings.length,
              )
              .map((vehicle) => (
                <AssignVehicleTile
                  key={vehicle.id}
                  vehicleData={vehicle}
                  selected={assignedVehicleId === vehicle.id}
                  onClick={() =>
                    onSelectVehicle(
                      assignedVehicleId === vehicle.id ? undefined : vehicle.id,
                    )
                  }
                  bookingStartDate={newBookingFormData.tripStartDate}
                  bookingEndDate={newBookingFormData.tripEndDate}
                  bookingPassengers={newBookingFormData.tripPassengers}
                  bookingNeedsAC={newBookingFormData.tripNeedsAC}
                />
              ))}
          </TileGridWrapper>
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            label={
              form.formState.isSubmitting
                ? t("Loading")
                : assignedVehicleId
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
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
