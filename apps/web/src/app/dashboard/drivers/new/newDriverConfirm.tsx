"use client"

import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import StepsTracker from "@/components/form/stepsTracker"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import { useTransition } from "react"
import ConfirmValues from "@/components/form/confirmValues"
import {
  NewFormActionWrapper,
  NewFormContentWrapper,
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
} from "@/components/page/pageWrappers"
import { NewFormWrapper } from "@/components/page/pageWrappers"

export function NewDriverConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: AddDriverRequestType
  agencyId: string
}) {
  const t = useTranslations("Dashboard.NewDriver.Confirm")
  const formData = useForm<AddDriverRequestType>()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  //Submit action
  const onSubmit = async () => {
    startTransition(async () => {
      // Add driver
      const newDriverData: AddDriverRequestType = {
        agencyId: props.agencyId,
        data: {
          name: props.newDriverFormData.data.name,
          email: props.newDriverFormData.data.email,
          phone: props.newDriverFormData.data.phone,
          address: props.newDriverFormData.data.address,
          canDriveVehicleTypes:
            props.newDriverFormData.data.canDriveVehicleTypes,
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
    })
  }
  return (
    <NewStepWrapper id="NewDriverConfirmStep">
      <NewStepHeaderWrapper>
        <NewStepTitleWrapper>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </NewStepTitleWrapper>
        <StepsTracker total={4} current={3} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </NewStepHeaderWrapper>
      <NewFormWrapper<AddDriverRequestType>
        id="ConfirmForm"
        form={formData}
        onSubmit={formData.handleSubmit(onSubmit)}
      >
        <NewFormContentWrapper>
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
            value={props.newDriverFormData.data.canDriveVehicleTypes.join(", ")}
          />
          {props.newDriverFormData.data.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${props.newDriverFormData.data.defaultAllowancePerDay}`}
            />
          )}
        </NewFormContentWrapper>
        <NewFormActionWrapper>
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
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={isPending}
          >
            {t("SecondaryCTA")}
          </Button>
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
