import { H4, PBold, SmallGrey, Caption } from "@/components/typography"
import { DriverRegex, VehicleRegex } from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  newBookingFormClassName,
  NewBookingFormDataType,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingSectionClassName,
  Step3Type,
  NewBookingTotalSteps,
} from "./newBookingCommon"
import NewBookingStepsTracker from "./newBookingStepsTracker"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import NewBookingVehicleTile from "./newBookingVehicleTile"
import NewBookingDriverTile from "./newBookingDriverTile"
import { Separator } from "@/components/ui/separator"
import { FindVehiclesByAgencyType } from "@ryogo-travel-app/api/services/vehicle.services"
import { FindDriversByAgencyType } from "@ryogo-travel-app/api/services/driver.services"

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

  // type Step3Type = z.infer<typeof step3Schema>;

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
        (vehicle) => vehicle.id === values.assignedVehicleId
      )?.defaultAcChargePerDay,
      selectedRatePerKm: props.vehicles.find(
        (vehicle) => vehicle.id === values.assignedVehicleId
      )?.defaultRatePerKm,
      selectedAllowancePerDay: props.drivers.find(
        (driver) => driver.id === values.assignedDriverId
      )?.defaultAllowancePerDay,
    })
    props.onNext()
  }

  return (
    <div id="AssignmentSection" className={newBookingSectionClassName}>
      <div id="AssignmentHeader" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <Caption>{t("Subtitle")}</Caption>
        </div>
        <NewBookingStepsTracker total={NewBookingTotalSteps} current={2} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="Step3Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <PBold>{t("Vehicle.Title")}</PBold>
          <div
            id="vehicleAssignment"
            className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3"
          >
            {props.vehicles
              .sort(
                (a, b) => a.assignedBookings.length - b.assignedBookings.length
              )
              .map((vehicle, index) => (
                <NewBookingVehicleTile
                  key={index}
                  vehicleData={vehicle}
                  newBookingFormData={props.newBookingFormData}
                  setValue={form.setValue}
                />
              ))}
          </div>
          <Separator />
          <PBold>{t("Driver.Title")}</PBold>
          <div
            id="driverAssignment"
            className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3"
          >
            {props.drivers.map((driver, index) => (
              <NewBookingDriverTile
                key={index}
                driverData={driver}
                newBookingFormData={props.newBookingFormData}
                setValue={form.setValue}
              />
            ))}
          </div>
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
        </form>
      </Form>
    </div>
  )
}
