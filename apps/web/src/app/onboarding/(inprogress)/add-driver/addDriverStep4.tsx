"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { RyogoH3 } from "@/components/typography"
import ConfirmValues from "@/components/form/confirmValues"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <RyogoH3 color="slate">{t("Title")}</RyogoH3>
          <ConfirmValues name={t("DriverName")} value={finalData.data.name} />
          <ConfirmValues name={t("DriverPhone")} value={finalData.data.phone} />
          <ConfirmValues name={t("DriverEmail")} value={finalData.data.email} />
          {finalData.data.licenseNumber && (
            <ConfirmValues
              name={t("LicenseNumber")}
              value={finalData.data.licenseNumber}
            />
          )}
          {finalData.data.licenseExpiresOn && (
            <ConfirmValues
              name={t("LicenseExpiresOn")}
              value={finalData.data.licenseExpiresOn.toDateString()}
            />
          )}
          {finalData.data.address && (
            <ConfirmValues
              name={t("DriverAddress")}
              value={finalData.data.address}
            />
          )}
          {finalData.data.canDriveVehicleTypes &&
            finalData.data.canDriveVehicleTypes.length > 0 && (
              <ConfirmValues
                name={t("CanDriveVehicleTypes")}
                value={finalData.data.canDriveVehicleTypes.join(", ")}
              />
            )}
          {finalData.data.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${finalData.data.defaultAllowancePerDay}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step4Actions">
          <RyogoDefaultButton
            className="w-full"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
          <RyogoOutlineButton
            size={"lg"}
            onClick={onPrev}
            className="w-full"
            disabled={formData.formState.isSubmitting}
            label={t("SecondaryCTA")}
          />
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
