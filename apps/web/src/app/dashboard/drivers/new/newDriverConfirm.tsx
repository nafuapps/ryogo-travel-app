"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import StepsTracker from "@/components/form/stepsTracker"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import ConfirmValues from "@/components/form/confirmValues"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  SectionRowWrapper,
  PageWrapper,
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
} from "@/components/page/pageWrappers"

export function NewDriverConfirm({
  onNext,
  onPrev,
  newDriverFormData,
  agencyId,
  userId,
  agencyName,
}: {
  onNext: () => void
  onPrev: () => void
  newDriverFormData: AddDriverRequestType
  agencyId: string
  userId: string
  agencyName: string
}) {
  const t = useTranslations("Dashboard.NewDriver.Confirm")
  const form = useForm<AddDriverRequestType>()
  const router = useRouter()

  const onSubmit = async () => {
    // Add driver
    const newDriverData: AddDriverRequestType = {
      agencyId: agencyId,
      addedByUserId: userId,
      data: {
        name: newDriverFormData.data.name,
        email: newDriverFormData.data.email,
        phone: newDriverFormData.data.phone,
        address: newDriverFormData.data.address,
        canDriveVehicleTypes: newDriverFormData.data.canDriveVehicleTypes,
        defaultAllowancePerDay: newDriverFormData.data.defaultAllowancePerDay,
        licenseNumber: newDriverFormData.data.licenseNumber,
        licenseExpiresOn: newDriverFormData.data.licenseExpiresOn,
        licensePhotos: newDriverFormData.data.licensePhotos,
        userPhotos: newDriverFormData.data.userPhotos,
      },
    }
    const addedDriver = await addDriverAction(newDriverData, agencyName)
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
  }
  return (
    <PageWrapper id="NewDriverConfirmStep">
      <FormWrapper<AddDriverRequestType>
        id="ConfirmForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SectionRowWrapper end>
          <RyogoH3>{t("Title")}</RyogoH3>
          <RyogoCaption color="light">{t("Subtitle")}</RyogoCaption>
        </SectionRowWrapper>
        <StepsTracker steps={"driver"} current={3} />
        <RyogoSmall color="slate">{t("Description")}</RyogoSmall>
        <FormContentWrapper>
          <ConfirmValues
            name={t("DriverName")}
            value={newDriverFormData.data.name}
          />
          <ConfirmValues
            name={t("DriverPhone")}
            value={newDriverFormData.data.phone}
          />
          <ConfirmValues
            name={t("DriverEmail")}
            value={newDriverFormData.data.email}
          />
          {newDriverFormData.data.licenseNumber && (
            <ConfirmValues
              name={t("LicenseNumber")}
              value={newDriverFormData.data.licenseNumber}
            />
          )}
          {newDriverFormData.data.licenseExpiresOn && (
            <ConfirmValues
              name={t("LicenseExpiresOn")}
              value={newDriverFormData.data.licenseExpiresOn.toDateString()}
            />
          )}
          {newDriverFormData.data.address && (
            <ConfirmValues
              name={t("DriverAddress")}
              value={newDriverFormData.data.address}
            />
          )}
          {newDriverFormData.data.canDriveVehicleTypes &&
            newDriverFormData.data.canDriveVehicleTypes.length > 0 && (
              <ConfirmValues
                name={t("CanDriveVehicleTypes")}
                value={newDriverFormData.data.canDriveVehicleTypes.join(", ")}
              />
            )}
          {newDriverFormData.data.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${newDriverFormData.data.defaultAllowancePerDay}`}
            />
          )}
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("SecondaryCTA")}
            type="button"
            onClick={onPrev}
            disabled={form.formState.isSubmitting}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
