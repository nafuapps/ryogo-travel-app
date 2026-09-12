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
      data: {
        name: finalData.data.name,
        email: finalData.data.email,
        phone: finalData.data.phone,
        address: finalData.data.address,
        canDriveVehicleTypes: finalData.data.canDriveVehicleTypes,
        defaultAllowancePerDay: finalData.data.defaultAllowancePerDay,
        licenseNumber: finalData.data.licenseNumber,
        licenseExpiresOn: finalData.data.licenseExpiresOn,
        licensePhotos: finalData.data.licensePhotos,
        userPhotos: finalData.data.userPhotos,
      },
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
            <DetailsLineItem
              label={t("DriverName")}
              value={finalData.data.name}
            />
            <DetailsLineItem
              label={t("DriverPhone")}
              value={finalData.data.phone}
            />
            <DetailsLineItem
              label={t("DriverEmail")}
              value={finalData.data.email}
            />
            {finalData.data.address && (
              <DetailsLineItem
                label={t("DriverAddress")}
                value={finalData.data.address}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("LicenseDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            {finalData.data.licenseNumber && (
              <DetailsLineItem
                label={t("LicenseNumber")}
                value={finalData.data.licenseNumber}
              />
            )}
            {finalData.data.licenseExpiresOn && (
              <DetailsLineItem
                label={t("LicenseExpiresOn")}
                value={finalData.data.licenseExpiresOn.toDateString()}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("AgencyDetails")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            {finalData.data.canDriveVehicleTypes &&
              finalData.data.canDriveVehicleTypes.length > 0 && (
                <DetailsLineItem
                  label={t("CanDriveVehicleTypes")}
                  value={finalData.data.canDriveVehicleTypes.join(", ")}
                />
              )}
            <DetailsLineItem
              label={t("DefaultAllowancePerDay")}
              value={`${finalData.data.defaultAllowancePerDay ?? NEW_BOOKING_DEFAULT_DRIVER_ALLOWANCE_PER_DAY}`}
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
