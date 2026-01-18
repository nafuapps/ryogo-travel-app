import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { CaptionGrey, H4, P, PBold, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { NewVehicleFormDataType } from "./newVehicleForm"
import { Button } from "@/components/ui/button"
import {
  newBookingSectionClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
} from "../../bookings/new/newBookingCommon"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"
import { NewVehicleRequestType } from "@ryogo-travel-app/api/types/vehicle.types"
import { newVehicleAction } from "./newVehicleAction"

export function NewVehicleConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: NewVehicleFormDataType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewVehicle.Confirm")
  const formData = useForm<NewVehicleFormDataType>()
  const router = useRouter()
  //Submit actions
  const onSubmit = async () => {
    // Add vehicle
    const newVehicleData: NewVehicleRequestType = {
      agencyId: props.agencyId,
      data: {
        vehicleNumber: props.newVehicleFormData.vehicleNumber,
        type: props.newVehicleFormData.type,
        brand: props.newVehicleFormData.brand,
        color: props.newVehicleFormData.color,
        model: props.newVehicleFormData.model,
        capacity: props.newVehicleFormData.capacity,
        odometerReading: props.newVehicleFormData.odometerReading,
        insuranceExpiresOn: props.newVehicleFormData.insuranceExpiresOn!,
        pucExpiresOn: props.newVehicleFormData.pucExpiresOn!,
        rcExpiresOn: props.newVehicleFormData.rcExpiresOn!,
        hasAC: props.newVehicleFormData.hasAC,
        defaultRatePerKm: props.newVehicleFormData.defaultRatePerKm,
        defaultAcChargePerDay: props.newVehicleFormData.defaultAcChargePerDay,
        insurancePhotos: props.newVehicleFormData.insurancePhotos,
        pucPhotos: props.newVehicleFormData.pucPhotos,
        rcPhotos: props.newVehicleFormData.rcPhotos,
        vehiclePhotos: props.newVehicleFormData.vehiclePhotos,
      },
    }
    const addedVehicle = await newVehicleAction(newVehicleData)

    if (addedVehicle.id) {
      //Send to added vehicle details page
      toast.success(t("APISuccess"))
      router.replace(`/dashboard/vehicles/${addedVehicle.id}`)
    } else {
      //If failed, Take back to vehicle page and show error
      toast.error(t("APIError"))
      router.replace("/dashboard/vehicles")
    }
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
              value={props.newVehicleFormData.vehicleNumber}
            />
            <ConfirmValues
              name={t("Type")}
              value={props.newVehicleFormData.type}
            />
            <ConfirmValues
              name={t("Brand")}
              value={props.newVehicleFormData.brand}
            />
            <ConfirmValues
              name={t("Model")}
              value={props.newVehicleFormData.model}
            />
            <ConfirmValues
              name={t("Color")}
              value={props.newVehicleFormData.color}
            />
            {props.newVehicleFormData.capacity && (
              <ConfirmValues
                name={t("Capacity")}
                value={`${props.newVehicleFormData.capacity}`}
              />
            )}
            {props.newVehicleFormData.odometerReading && (
              <ConfirmValues
                name={t("OdometerReading")}
                value={`${props.newVehicleFormData.odometerReading}`}
              />
            )}
            <ConfirmValues
              name={t("InsuranceExpiresOn")}
              value={props.newVehicleFormData.insuranceExpiresOn!.toDateString()}
            />
            <ConfirmValues
              name={t("PUCExpiresOn")}
              value={props.newVehicleFormData.pucExpiresOn!.toDateString()}
            />
            <ConfirmValues
              name={t("RCExpiresOn")}
              value={props.newVehicleFormData.rcExpiresOn!.toDateString()}
            />
            {props.newVehicleFormData.defaultRatePerKm && (
              <ConfirmValues
                name={t("RatePerKm")}
                value={`${props.newVehicleFormData.defaultRatePerKm}`}
              />
            )}
            <ConfirmValues
              name={t("HasAC")}
              value={props.newVehicleFormData.hasAC ? "Yes" : "No"}
            />
            {props.newVehicleFormData.hasAC &&
              props.newVehicleFormData.defaultAcChargePerDay && (
                <ConfirmValues
                  name={t("ACChagePerDay")}
                  value={`${props.newVehicleFormData.defaultAcChargePerDay}`}
                />
              )}
          </div>
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
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("SecondaryCTA")}
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
