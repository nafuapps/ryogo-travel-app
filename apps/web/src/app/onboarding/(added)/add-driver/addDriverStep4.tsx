import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { AddDriverFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "@/app/onboarding/components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { H3Grey } from "@/components/typography"
import ConfirmValues from "@/app/onboarding/components/confirmValues"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import { addDriverAction } from "./addDriverAction"

export function AddDriverConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddDriverFormDataType
  ownerId: string
  userStatus: UserStatusEnum
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Confirm")
  const router = useRouter()

  const formData = useForm<AddDriverFormDataType>()
  //Submit actions
  const onSubmit = async () => {
    // Add driver
    const newDriverData: AddDriverRequestType = {
      agencyId: props.finalData.agencyId,
      ownerId:
        props.userStatus == UserStatusEnum.NEW ? props.ownerId : undefined,
      data: {
        name: props.finalData.name,
        email: props.finalData.email,
        phone: props.finalData.phone,
        address: props.finalData.address,
        canDriveVehicleTypes: props.finalData.canDriveVehicleTypes,
        defaultAllowancePerDay: props.finalData.defaultAllowancePerDay,
        licenseNumber: props.finalData.licenseNumber,
        licenseExpiresOn: props.finalData.licenseExpiresOn!,
        licensePhotos: props.finalData.licensePhotos,
        userPhotos: props.finalData.driverPhotos,
      },
    }
    const addedDriver = await addDriverAction(newDriverData)
    if (addedDriver.id) {
      //Move to next step
      props.onNext()
    } else {
      //If failed, Take back to driver onboarding page and show error
      toast.error(t("APIError"))
      router.replace("/onboarding/add-driver")
    }
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step4Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues name={t("DriverName")} value={props.finalData.name} />
          <ConfirmValues
            name={t("DriverPhone")}
            value={props.finalData.phone}
          />
          <ConfirmValues
            name={t("DriverEmail")}
            value={props.finalData.email}
          />
          <ConfirmValues
            name={t("LicenseNumber")}
            value={props.finalData.licenseNumber}
          />
          <ConfirmValues
            name={t("LicenseExpiresOn")}
            value={props.finalData.licenseExpiresOn!.toDateString()}
          />
          <ConfirmValues
            name={t("DriverAddress")}
            value={props.finalData.address}
          />
          <ConfirmValues
            name={t("CanDriveVehicleTypes")}
            value={props.finalData.canDriveVehicleTypes.join(", ")}
          />
          {props.finalData.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${props.finalData.defaultAllowancePerDay}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step4Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
          <OnboardingStepSecondaryAction
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </OnboardingStepSecondaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  )
}
