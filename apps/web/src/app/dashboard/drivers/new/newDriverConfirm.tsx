"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import StepsTracker from "@/components/form/stepsTracker"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import { useTransition } from "react"
import ConfirmValues from "@/components/form/confirmValues"
import {
  NewStepHeaderWrapper,
  NewStepTitleWrapper,
  NewStepWrapper,
  NewFormWrapper,
  NewFormContentWrapper,
  NewFormActionWrapper,
} from "@/components/form/newFormWrappers"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export function NewDriverConfirm(props: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: AddDriverRequestType
  agencyId: string
  agencyName: string
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
      const addedDriver = await addDriverAction(newDriverData, props.agencyName)
      if (addedDriver) {
        //Send to driver details page
        toast.success(t("APISuccess"))
        window.open(
          addedDriver.whatsappInviteLink,
          "_blank",
          "noopener,noreferrer",
        )
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
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </NewStepTitleWrapper>
        <StepsTracker steps={"driver"} current={3} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
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
          {props.newDriverFormData.data.licenseNumber && (
            <ConfirmValues
              name={t("LicenseNumber")}
              value={props.newDriverFormData.data.licenseNumber}
            />
          )}
          {props.newDriverFormData.data.licenseExpiresOn && (
            <ConfirmValues
              name={t("LicenseExpiresOn")}
              value={props.newDriverFormData.data.licenseExpiresOn.toDateString()}
            />
          )}
          {props.newDriverFormData.data.address && (
            <ConfirmValues
              name={t("DriverAddress")}
              value={props.newDriverFormData.data.address}
            />
          )}
          {props.newDriverFormData.data.canDriveVehicleTypes &&
            props.newDriverFormData.data.canDriveVehicleTypes.length > 0 && (
              <ConfirmValues
                name={t("CanDriveVehicleTypes")}
                value={props.newDriverFormData.data.canDriveVehicleTypes.join(
                  ", ",
                )}
              />
            )}
          {props.newDriverFormData.data.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${props.newDriverFormData.data.defaultAllowancePerDay}`}
            />
          )}
        </NewFormContentWrapper>
        <NewFormActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={isPending ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={isPending}
            showSpinner={isPending}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={props.onPrev}
            disabled={isPending}
          />
        </NewFormActionWrapper>
      </NewFormWrapper>
    </NewStepWrapper>
  )
}
