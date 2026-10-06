"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  StickyActionWrapper,
  FormContentWrapper,
  FormWrapper,
  PageWrapper,
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
  DetailsLineItem,
} from "@/components/page/pageWrappers"
import FormStepHeader from "@/components/form/formStepHeader"
import {
  AddDriverTotalSteps,
  NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY,
} from "@/lib/uiConfig"
import { RyogoCaption } from "@/components/typography"

export function NewDriverConfirm({
  onPrev,
  newDriverFormData,
  agencyId,
  userId,
  agencyName,
}: {
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
    const addedDriver = await addDriverAction({
      data: {
        agencyId: agencyId,
        addedByUserId: userId,
        name: newDriverFormData.name,
        email: newDriverFormData.email,
        phone: newDriverFormData.phone,
        address: newDriverFormData.address,
        canDriveVehicleTypes: newDriverFormData.canDriveVehicleTypes,
        defaultAllowancePerDay: newDriverFormData.defaultAllowancePerDay,
        licenseNumber: newDriverFormData.licenseNumber,
        licenseExpiresOn: newDriverFormData.licenseExpiresOn,
        licensePhotos: newDriverFormData.licensePhotos,
        userPhotos: newDriverFormData.userPhotos,
      },
      agencyName,
    })
    if (addedDriver) {
      //Send to driver details page
      toast.success(t("APISuccess"))
      if (addedDriver.whatsappInviteLink) {
        window.open(
          addedDriver.whatsappInviteLink,
          "_blank",
          "noopener,noreferrer",
        )
      }
      router.replace(`/dashboard/drivers/${addedDriver.id}?feedback=true`)
    } else {
      //If failed, Take back to driver page and show error
      toast.error(t("APIError"))
      router.replace("/dashboard/drivers")
    }
  }
  return (
    <PageWrapper id="NewDriverConfirmStep">
      <FormStepHeader
        title={t("Title")}
        stepLabel={t("Subtitle", { current: 4, total: AddDriverTotalSteps })}
        description={t("Description")}
        totalSteps={AddDriverTotalSteps}
        currentStepIndex={3}
        href={"/dashboard/support/help-drivers#adding"}
      />
      <FormWrapper<AddDriverRequestType>
        id="ConfirmForm"
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormContentWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("UserDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              <DetailsLineItem
                label={t("DriverName")}
                value={newDriverFormData.name}
              />
              <DetailsLineItem
                label={t("DriverPhone")}
                value={newDriverFormData.phone}
              />
              <DetailsLineItem
                label={t("DriverEmail")}
                value={newDriverFormData.email}
              />
              {newDriverFormData.address && (
                <DetailsLineItem
                  label={t("DriverAddress")}
                  value={newDriverFormData.address}
                />
              )}
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("LicenseDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              {newDriverFormData.licenseNumber && (
                <DetailsLineItem
                  label={t("LicenseNumber")}
                  value={newDriverFormData.licenseNumber}
                />
              )}
              {newDriverFormData.licenseExpiresOn && (
                <DetailsLineItem
                  label={t("LicenseExpiresOn")}
                  value={newDriverFormData.licenseExpiresOn.toDateString()}
                />
              )}
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("AgencyDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              {newDriverFormData.canDriveVehicleTypes &&
                newDriverFormData.canDriveVehicleTypes.length > 0 && (
                  <DetailsLineItem
                    label={t("CanDriveVehicleTypes")}
                    value={newDriverFormData.canDriveVehicleTypes.join(", ")}
                  />
                )}
              <DetailsLineItem
                label={t("DefaultAllowancePerDay")}
                value={`${newDriverFormData.defaultAllowancePerDay ?? NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY}`}
              />
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
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
