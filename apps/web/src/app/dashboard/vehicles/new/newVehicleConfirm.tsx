import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { CaptionGrey, H4, P, PBold, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  newBookingSectionClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
} from "../../bookings/new/newBookingCommon"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"
import { AddVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { addVehicleAction } from "@/app/actions/vehicles/addVehicleAction"
import { useTransition } from "react"

export function NewVehicleConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: AddVehicleRequestType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewVehicle.Confirm")
  const formData = useForm<AddVehicleRequestType>()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  //Submit actions
  const onSubmit = async () => {
    startTransition(async () => {
      // Add vehicle
      const newVehicleData: AddVehicleRequestType = {
        agencyId: props.agencyId,
        data: {
          vehicleNumber: props.newVehicleFormData.data.vehicleNumber,
          type: props.newVehicleFormData.data.type,
          brand: props.newVehicleFormData.data.brand,
          color: props.newVehicleFormData.data.color,
          model: props.newVehicleFormData.data.model,
          capacity: props.newVehicleFormData.data.capacity,
          odometerReading: props.newVehicleFormData.data.odometerReading,
          insuranceExpiresOn: props.newVehicleFormData.data.insuranceExpiresOn,
          pucExpiresOn: props.newVehicleFormData.data.pucExpiresOn,
          rcExpiresOn: props.newVehicleFormData.data.rcExpiresOn,
          hasAC: props.newVehicleFormData.data.hasAC,
          defaultRatePerKm: props.newVehicleFormData.data.defaultRatePerKm,
          defaultAcChargePerDay:
            props.newVehicleFormData.data.defaultAcChargePerDay,
          insurancePhotos: props.newVehicleFormData.data.insurancePhotos,
          pucPhotos: props.newVehicleFormData.data.pucPhotos,
          rcPhotos: props.newVehicleFormData.data.rcPhotos,
          vehiclePhotos: props.newVehicleFormData.data.vehiclePhotos,
        },
      }
      const addedVehicle = await addVehicleAction(newVehicleData)

      if (addedVehicle) {
        //Send to added vehicle details page
        toast.success(t("APISuccess"))
        router.replace(`/dashboard/vehicles/${addedVehicle.id}`)
      } else {
        //If failed, Take back to vehicle page and show error
        toast.error(t("APIError"))
        router.replace("/dashboard/vehicles")
      }
    })
  }
  return (
    <div id="NewVehicleConfirm" className={newBookingSectionClassName}>
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={4} current={3} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...formData}>
        <form
          id="ConfirmForm"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="ConfirmFields" className="flex flex-col gap-3 lg:gap-4">
            <ConfirmValues
              name={t("VehicleNumber")}
              value={props.newVehicleFormData.data.vehicleNumber}
            />
            <ConfirmValues
              name={t("Type")}
              value={props.newVehicleFormData.data.type}
            />
            <ConfirmValues
              name={t("Brand")}
              value={props.newVehicleFormData.data.brand}
            />
            <ConfirmValues
              name={t("Model")}
              value={props.newVehicleFormData.data.model}
            />
            <ConfirmValues
              name={t("Color")}
              value={props.newVehicleFormData.data.color}
            />
            {props.newVehicleFormData.data.capacity && (
              <ConfirmValues
                name={t("Capacity")}
                value={`${props.newVehicleFormData.data.capacity}`}
              />
            )}
            {props.newVehicleFormData.data.odometerReading && (
              <ConfirmValues
                name={t("OdometerReading")}
                value={`${props.newVehicleFormData.data.odometerReading}`}
              />
            )}
            {props.newVehicleFormData.data.insuranceExpiresOn && (
              <ConfirmValues
                name={t("InsuranceExpiresOn")}
                value={props.newVehicleFormData.data.insuranceExpiresOn.toDateString()}
              />
            )}
            {props.newVehicleFormData.data.pucExpiresOn && (
              <ConfirmValues
                name={t("PUCExpiresOn")}
                value={props.newVehicleFormData.data.pucExpiresOn.toDateString()}
              />
            )}
            {props.newVehicleFormData.data.rcExpiresOn && (
              <ConfirmValues
                name={t("RCExpiresOn")}
                value={props.newVehicleFormData.data.rcExpiresOn.toDateString()}
              />
            )}
            {props.newVehicleFormData.data.defaultRatePerKm && (
              <ConfirmValues
                name={t("RatePerKm")}
                value={`${props.newVehicleFormData.data.defaultRatePerKm}`}
              />
            )}
            <ConfirmValues
              name={t("HasAC")}
              value={props.newVehicleFormData.data.hasAC ? "Yes" : "No"}
            />
            {props.newVehicleFormData.data.hasAC &&
              props.newVehicleFormData.data.defaultAcChargePerDay && (
                <ConfirmValues
                  name={t("ACChagePerDay")}
                  value={`${props.newVehicleFormData.data.defaultAcChargePerDay}`}
                />
              )}
          </div>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={isPending}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}

type ConfirmValuesProps = {
  name: string
  value: string
}

export default function ConfirmValues({ name, value }: ConfirmValuesProps) {
  return (
    <div className="flex flex-row justify-between w-full items-start gap-5 lg:gap-6">
      <PBold>{name}</PBold>
      <div className="text-right">
        <P>{value}</P>
      </div>
    </div>
  )
}
