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
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"

export function NewDriverConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: AddDriverRequestType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewDriver.Confirm")
  const formData = useForm<AddDriverRequestType>()
  const router = useRouter()

  //Submit action
  const onSubmit = async () => {
    // Add driver
    const newDriverData: AddDriverRequestType = {
      agencyId: props.agencyId,
      data: {
        name: props.newDriverFormData.data.name,
        email: props.newDriverFormData.data.email,
        phone: props.newDriverFormData.data.phone,
        address: props.newDriverFormData.data.address,
        canDriveVehicleTypes: props.newDriverFormData.data.canDriveVehicleTypes,
        defaultAllowancePerDay:
          props.newDriverFormData.data.defaultAllowancePerDay,
        licenseNumber: props.newDriverFormData.data.licenseNumber,
        licenseExpiresOn: props.newDriverFormData.data.licenseExpiresOn,
        licensePhotos: props.newDriverFormData.data.licensePhotos,
        userPhotos: props.newDriverFormData.data.userPhotos,
      },
    }
    const addedDriver = await addDriverAction(newDriverData)

    if (addedDriver) {
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
              value={props.newDriverFormData.data.name}
            />
            <ConfirmValues
              name={t("DriverPhone")}
              value={props.newDriverFormData.data.phone}
            />
            <ConfirmValues
              name={t("DriverEmail")}
              value={props.newDriverFormData.data.email}
            />
            <ConfirmValues
              name={t("LicenseNumber")}
              value={props.newDriverFormData.data.licenseNumber}
            />
            {props.newDriverFormData.data.licenseExpiresOn && (
              <ConfirmValues
                name={t("LicenseExpiresOn")}
                value={props.newDriverFormData.data.licenseExpiresOn.toDateString()}
              />
            )}
            <ConfirmValues
              name={t("DriverAddress")}
              value={props.newDriverFormData.data.address}
            />
            <ConfirmValues
              name={t("CanDriveVehicleTypes")}
              value={props.newDriverFormData.data.canDriveVehicleTypes.join(
                ", ",
              )}
            />
            {props.newDriverFormData.data.defaultAllowancePerDay && (
              <ConfirmValues
                name={t("DefaultAllowancePerDay")}
                value={`${props.newDriverFormData.data.defaultAllowancePerDay}`}
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
