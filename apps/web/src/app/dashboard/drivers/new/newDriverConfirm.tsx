import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { CaptionGrey, H4, P, PBold, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { NewDriverFormDataType } from "./newDriverForm"
import { Button } from "@/components/ui/button"
import {
  newBookingSectionClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
} from "../../bookings/new/newBookingCommon"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"
import { NewDriverRequestType } from "@ryogo-travel-app/api/types/driver.types"
import { newDriverAction } from "./newDriverAction"

export function NewDriverConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: NewDriverFormDataType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewDriver.Confirm")
  const formData = useForm<NewDriverFormDataType>()
  const router = useRouter()

  //Submit action
  const onSubmit = async () => {
    // Add driver
    const newDriverData: NewDriverRequestType = {
      agencyId: props.agencyId,
      data: {
        name: props.newDriverFormData.name,
        email: props.newDriverFormData.email,
        phone: props.newDriverFormData.phone,
        address: props.newDriverFormData.address,
        canDriveVehicleTypes: props.newDriverFormData.canDriveVehicleTypes,
        defaultAllowancePerDay: props.newDriverFormData.defaultAllowancePerDay,
        licenseNumber: props.newDriverFormData.licenseNumber,
        licenseExpiresOn: props.newDriverFormData.licenseExpiresOn!,
        licensePhotos: props.newDriverFormData.licensePhotos,
        driverPhotos: props.newDriverFormData.driverPhotos,
      },
    }
    const addedDriver = await newDriverAction(newDriverData)

    if (addedDriver.id) {
      //Send to driver details page
      toast.success(t("APISuccess"))
      router.replace(`/dashboard/drivers/${addedDriver.id}`)
    } else {
      //If failed, Take back to driver page and show error
      toast.error(t("APIError"))
      router.replace("/dashboard/drivers")
    }
  }
  return (
    <div id="NewDriverConfirm" className={newBookingSectionClassName}>
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
              name={t("DriverName")}
              value={props.newDriverFormData.name}
            />
            <ConfirmValues
              name={t("DriverPhone")}
              value={props.newDriverFormData.phone}
            />
            <ConfirmValues
              name={t("DriverEmail")}
              value={props.newDriverFormData.email}
            />
            <ConfirmValues
              name={t("LicenseNumber")}
              value={props.newDriverFormData.licenseNumber}
            />
            <ConfirmValues
              name={t("LicenseExpiresOn")}
              value={props.newDriverFormData.licenseExpiresOn!.toDateString()}
            />
            <ConfirmValues
              name={t("DriverAddress")}
              value={props.newDriverFormData.address}
            />
            <ConfirmValues
              name={t("CanDriveVehicleTypes")}
              value={props.newDriverFormData.canDriveVehicleTypes.join(", ")}
            />
            {props.newDriverFormData.defaultAllowancePerDay && (
              <ConfirmValues
                name={t("DefaultAllowancePerDay")}
                value={`${props.newDriverFormData.defaultAllowancePerDay}`}
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
