"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
  DetailsLineItem,
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY } from "@/lib/uiConfig"

export function AddDriverConfirm({
  onNext,
  onPrev,
  finalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: AddDriverRequestType
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Confirm")
  const router = useRouter()

  const formData = useForm<AddDriverRequestType>()
  //Submit actions
  const onSubmit = async () => {
    // Add driver
    const newDriverData: AddDriverRequestType = {
      agencyId: finalData.agencyId,
      addedByUserId: finalData.addedByUserId,
      name: finalData.name,
      email: finalData.email,
      phone: finalData.phone,
      address: finalData.address,
      canDriveVehicleTypes: finalData.canDriveVehicleTypes,
      defaultAllowancePerDay: finalData.defaultAllowancePerDay,
      licenseNumber: finalData.licenseNumber,
      licenseExpiresOn: finalData.licenseExpiresOn,
      licensePhotos: finalData.licensePhotos,
      userPhotos: finalData.userPhotos,
    }
    const addedDriver = await addDriverAction(newDriverData)
    if (addedDriver) {
      //Move to next step
      onNext()
    } else {
      //If failed, Take back to driver onboarding page and show error
      toast.error(t("APIError"))
      router.refresh()
    }
  }
  return (
    <FormWrapper
      id="Step4Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoP color="slate">{t("Title")}</RyogoP>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("UserDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            <DetailsLineItem label={t("DriverName")} value={finalData.name} />
            <DetailsLineItem label={t("DriverPhone")} value={finalData.phone} />
            <DetailsLineItem label={t("DriverEmail")} value={finalData.email} />
            {finalData.address && (
              <DetailsLineItem
                label={t("DriverAddress")}
                value={finalData.address}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("LicenseDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            {finalData.licenseNumber && (
              <DetailsLineItem
                label={t("LicenseNumber")}
                value={finalData.licenseNumber}
              />
            )}
            {finalData.licenseExpiresOn && (
              <DetailsLineItem
                label={t("LicenseExpiresOn")}
                value={finalData.licenseExpiresOn.toDateString()}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("AgencyDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            {finalData.canDriveVehicleTypes &&
              finalData.canDriveVehicleTypes.length > 0 && (
                <DetailsLineItem
                  label={t("CanDriveVehicleTypes")}
                  value={finalData.canDriveVehicleTypes.join(", ")}
                />
              )}
            <DetailsLineItem
              label={t("DefaultAllowancePerDay")}
              value={`${finalData.defaultAllowancePerDay ?? NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY}`}
            />
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
          disabled={formData.formState.isSubmitting}
          showSpinner={formData.formState.isSubmitting}
          label={
            formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
          }
        />
        <RyogoOutlineButton
          size={"lg"}
          onClick={onPrev}
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
