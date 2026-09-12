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
      <FormStepHeader
        title={t("Title")}
        stepLabel={t("Subtitle", { current: 4, total: AddDriverTotalSteps })}
        description={t("Description")}
        totalSteps={AddDriverTotalSteps}
        currentStepIndex={3}
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
                value={newDriverFormData.data.name}
              />
              <DetailsLineItem
                label={t("DriverPhone")}
                value={newDriverFormData.data.phone}
              />
              <DetailsLineItem
                label={t("DriverEmail")}
                value={newDriverFormData.data.email}
              />
              {newDriverFormData.data.address && (
                <DetailsLineItem
                  label={t("DriverAddress")}
                  value={newDriverFormData.data.address}
                />
              )}
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("LicenseDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              {newDriverFormData.data.licenseNumber && (
                <DetailsLineItem
                  label={t("LicenseNumber")}
                  value={newDriverFormData.data.licenseNumber}
                />
              )}
              {newDriverFormData.data.licenseExpiresOn && (
                <DetailsLineItem
                  label={t("LicenseExpiresOn")}
                  value={newDriverFormData.data.licenseExpiresOn.toDateString()}
                />
              )}
            </DetailsContentWrapper>
          </DetailsBorderWrapper>
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light">{t("AgencyDetails")}</RyogoCaption>
            </DetailsHeaderWrapper>
            <DetailsContentWrapper>
              {newDriverFormData.data.canDriveVehicleTypes &&
                newDriverFormData.data.canDriveVehicleTypes.length > 0 && (
                  <DetailsLineItem
                    label={t("CanDriveVehicleTypes")}
                    value={newDriverFormData.data.canDriveVehicleTypes.join(
                      ", ",
                    )}
                  />
                )}
              <DetailsLineItem
                label={t("DefaultAllowancePerDay")}
                value={`${newDriverFormData.data.defaultAllowancePerDay ?? NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY}`}
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
