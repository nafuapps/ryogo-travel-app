"use client"

import { H4, PBold, SmallGrey, Caption } from "@/components/typography"
import { DriverRegex, VehicleRegex } from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"

import StepsTracker, {
  NewBookingTotalSteps,
} from "@/components/form/stepsTracker"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"
import AssignDriverTile from "@/components/bookings/assign/assignDriverTile"
import AssignVehicleTile from "@/components/bookings/assign/assignVehicleTile"
import {
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import { NewBookingFormDataType } from "@ryogo-travel-app/api/types/booking.types"

type NewBookingStep3Props = {
  onNext: () => void
  onPrev: () => void
  newBookingFormData: NewBookingFormDataType
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >
  vehicles: FindVehiclesByAgencyType
  drivers: FindDriversByAgencyType
}
export default function NewBookingStep3(props: NewBookingStep3Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step3")

  const step3Schema = z.object({
    //Assignment
    assignedDriverId: DriverRegex.optional(),
    assignedVehicleId: VehicleRegex.optional(),
  })

  type Step3Type = z.infer<typeof step3Schema>

  //Form init
  const form = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      assignedDriverId: props.newBookingFormData.assignedDriverId,
      assignedVehicleId: props.newBookingFormData.assignedVehicleId,
    },
  })

  //Form submit
  function onSubmit(values: Step3Type) {
    props.setNewBookingFormData({
      ...props.newBookingFormData,
      assignedDriverId: values.assignedDriverId,
      assignedVehicleId: values.assignedVehicleId,
      selectedAcChargePerDay: props.vehicles.find(
        (vehicle) => vehicle.id === values.assignedVehicleId,
      )?.defaultAcChargePerDay,
      selectedRatePerKm: props.vehicles.find(
        (vehicle) => vehicle.id === values.assignedVehicleId,
      )?.defaultRatePerKm,
      selectedAllowancePerDay: props.drivers.find(
        (driver) => driver.id === values.assignedDriverId,
      )?.defaultAllowancePerDay,
    })
    props.onNext()
  }

  const assignedVehicleId = useWatch({
    name: "assignedVehicleId",
    control: form.control,
  })

  const assignedDriverId = useWatch({
    name: "assignedDriverId",
    control: form.control,
  })

  return (
    <NewStepWrapper id="AssignmentStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <H4>{t("Title")}</H4>
          <Caption>{t("Subtitle")}</Caption>
        </NewStepTitleWrapper>
        <StepsTracker total={NewBookingTotalSteps} current={2} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<Step3Type>
        id="Step3Form"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
          <PBold>{t("Vehicle.Title")}</PBold>
          <div
            id="vehicleAssignment"
            className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3"
          >
            {props.vehicles
              .sort(
                (a, b) => a.assignedBookings.length - b.assignedBookings.length,
              )
              .map((vehicle, index) => (
                <AssignVehicleTile
                  key={index}
                  vehicleData={vehicle}
                  selected={assignedVehicleId === vehicle.id}
                  onClick={() => form.setValue("assignedVehicleId", vehicle.id)}
                  bookingStartDate={props.newBookingFormData.tripStartDate}
                  bookingEndDate={props.newBookingFormData.tripEndDate}
                  bookingPassengers={props.newBookingFormData.tripPassengers}
                  bookingNeedsAC={props.newBookingFormData.tripNeedsAC}
                />
              ))}
          </div>
        </NewFormContentWrapper>
        <NewFormContentWrapper>
          <PBold>{t("Driver.Title")}</PBold>
          <div
            id="driverAssignment"
            className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3"
          >
            {props.drivers.map((driver, index) => (
              <AssignDriverTile
                key={index}
                driverData={driver}
                bookingStartDate={props.newBookingFormData.tripStartDate}
                bookingEndDate={props.newBookingFormData.tripEndDate}
                bookingPassengers={props.newBookingFormData.tripPassengers}
                selected={assignedDriverId === driver.id}
                onClick={() => form.setValue("assignedDriverId", driver.id)}
              />
            ))}
          </div>
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={form.formState.isSubmitting}
          >
            {t("Back")}
          </Button>
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
