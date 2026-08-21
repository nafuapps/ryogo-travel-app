"use client"

import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { VehicleIdRegex } from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import StepsTracker from "@/components/form/stepsTracker"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import AssignVehicleTile from "@/components/flows/bookings/assign/assignVehicleTile"
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
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import Link from "next/link"
import {
  NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
  NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
} from "@/lib/uiConfig"

export default function NewBookingStepVehicle(props: {
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
      assignedVehicleId: props.newBookingFormData.assignedVehicleId,
    },
  })

  //Form submit
  function onSubmit(values: StepVehicleType) {
    const selectedVehicle = props.vehicles.find(
      (vehicle) => vehicle.id === values.assignedVehicleId,
    )
    props.setNewBookingFormData({
      ...props.newBookingFormData,
      assignedVehicleId: values.assignedVehicleId,
      selectedAcChargePerDay: selectedVehicle
        ? selectedVehicle.defaultAcChargePerDay
        : NEW_BOOKING_DEFAULT_VEHICLE_AC_CHARGE_PER_DAY,
      selectedRatePerKm: selectedVehicle
        ? selectedVehicle.defaultRatePerKm
        : NEW_BOOKING_DEFAULT_VEHICLE_RATE_PER_KM,
    })
    props.onNext()
  }

  const assignedVehicleId = useWatch({
    name: "assignedVehicleId",
    control: form.control,
  })

  return (
    <NewStepWrapper id="AssignmentStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">
            {t("Subtitle", { current: 2, total: 5 })}
          </RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"booking"} current={1} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
      </NewStepHeaderWrapper>
      {props.limited && (
        <SectionWrapper id="SubscribeAction">
          <SectionRowWrapper center>
            <RyogoCaption color="yellow">
              {props.isSubscribed ? t("ExpiredWarning") : t("TrialWarning")}
            </RyogoCaption>
            <Link href="/dashboard/account/subscription">
              <Button variant={"outline"}>
                <RyogoCaption color="light">
                  {props.isSubscribed
                    ? t("RenewCTA")
                    : props.hasTriedSubscription
                      ? t("BuyCTA")
                      : t("TryCTA")}
                </RyogoCaption>
              </Button>
            </Link>
          </SectionRowWrapper>
        </SectionWrapper>
      )}
      <NewFormWrapper<StepVehicleType>
        id="StepVehicleForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <NewStepGridWrapper>
            {props.vehicles
              .sort(
                (a, b) => a.assignedBookings.length - b.assignedBookings.length,
              )
              .map((vehicle, index) => (
                <AssignVehicleTile
                  key={index}
                  vehicleData={vehicle}
                  selected={assignedVehicleId === vehicle.id}
                  onClick={() =>
                    form.setValue(
                      "assignedVehicleId",
                      assignedVehicleId !== vehicle.id ? vehicle.id : undefined,
                    )
                  }
                  bookingStartDate={props.newBookingFormData.tripStartDate}
                  bookingEndDate={props.newBookingFormData.tripEndDate}
                  bookingPassengers={props.newBookingFormData.tripPassengers}
                  bookingNeedsAC={props.newBookingFormData.tripNeedsAC}
                />
              ))}
          </NewStepGridWrapper>
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            <RyogoCaption color="white">
              {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </RyogoCaption>
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={form.formState.isSubmitting}
          >
            <RyogoCaption color="light">{t("Back")}</RyogoCaption>
          </Button>
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
