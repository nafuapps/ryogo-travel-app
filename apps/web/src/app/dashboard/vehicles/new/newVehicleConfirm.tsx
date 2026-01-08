import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { CaptionGrey, H4, P, PBold, SmallGrey } from "@/components/typography"
import {
  apiClient,
  apiClientWithoutHeaders,
} from "@ryogo-travel-app/api/client/apiClient"
import { redirect, RedirectType } from "next/navigation"
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
import {
  NewVehicleAPIRequestType,
  NewVehicleAPIResponseType,
} from "@ryogo-travel-app/api/types/vehicle.types"

export function NewVehicleConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: NewVehicleFormDataType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewVehicle.Confirm")
  const formData = useForm<NewVehicleFormDataType>()
  //Submit actions
  const onSubmit = async () => {
    // Add vehicle
    const newVehicleData: NewVehicleAPIRequestType = {
      agencyId: props.agencyId,
      data: {
        name: props.newVehicleFormData.name,
        email: props.newVehicleFormData.email,
        phone: props.newVehicleFormData.phone,
        address: props.newVehicleFormData.address,
        canDriveVehicleTypes: props.newVehicleFormData.canDriveVehicleTypes,
        defaultAllowancePerDay: props.newVehicleFormData.defaultAllowancePerDay,
        licenseNumber: props.newVehicleFormData.licenseNumber,
        licenseExpiresOn: props.newVehicleFormData.licenseExpiresOn!,
      },
    }
    const addedVehicle = await apiClient<NewVehicleAPIResponseType>(
      "/api/new-vehicle",
      { method: "POST", body: JSON.stringify(newVehicleData) }
    )
    if (addedVehicle.id) {
      //If success, Try to upload license photo and vehicle user photo
      if (props.newVehicleFormData.licensePhotos) {
        const licenseFormData = new FormData()
        licenseFormData.append(
          "license",
          props.newVehicleFormData.licensePhotos[0]!
        )
        licenseFormData.append("id", addedVehicle.id)
        await apiClientWithoutHeaders(`/api/new-vehicle/upload-license`, {
          method: "POST",
          body: licenseFormData,
        })
      }
      if (props.newVehicleFormData.vehiclePhotos) {
        const photoFormData = new FormData()
        photoFormData.append(
          "photo",
          props.newVehicleFormData.vehiclePhotos[0]!
        )
        photoFormData.append("userId", addedVehicle.userId)
        await apiClientWithoutHeaders(`/api/new-vehicle/upload-user-photo`, {
          method: "POST",
          body: photoFormData,
        })
      }
      //Send to added vehicle details page
      redirect(`/dashboard/vehicles/${addedVehicle.id}`)
    } else {
      //If failed, Take back to vehicle page and show error
      toast.error(t("APIError"))
      redirect("/dashboard/vehicles", RedirectType.replace)
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
              name={t("VehicleName")}
              value={props.newVehicleFormData.name}
            />
            <ConfirmValues
              name={t("VehiclePhone")}
              value={props.newVehicleFormData.phone}
            />
            <ConfirmValues
              name={t("VehicleEmail")}
              value={props.newVehicleFormData.email}
            />
            <ConfirmValues
              name={t("LicenseNumber")}
              value={props.newVehicleFormData.licenseNumber}
            />
            <ConfirmValues
              name={t("LicenseExpiresOn")}
              value={props.newVehicleFormData.licenseExpiresOn!.toDateString()}
            />
            <ConfirmValues
              name={t("VehicleAddress")}
              value={props.newVehicleFormData.address}
            />
            <ConfirmValues
              name={t("CanDriveVehicleTypes")}
              value={props.newVehicleFormData.canDriveVehicleTypes.join(", ")}
            />
            {props.newVehicleFormData.defaultAllowancePerDay && (
              <ConfirmValues
                name={t("DefaultAllowancePerDay")}
                value={`${props.newVehicleFormData.defaultAllowancePerDay}`}
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
            type="submit"
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
