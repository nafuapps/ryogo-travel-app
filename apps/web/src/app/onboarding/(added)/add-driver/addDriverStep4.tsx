import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
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
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"

export function AddDriverConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: AddDriverRequestType
  ownerId: string
  userStatus: UserStatusEnum
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Confirm")
  const router = useRouter()

  const formData = useForm<AddDriverRequestType>()
  //Submit actions
  const onSubmit = async () => {
    // Add driver
    const newDriverData: AddDriverRequestType = {
      agencyId: props.finalData.agencyId,
      ownerId:
        props.userStatus === UserStatusEnum.NEW ? props.ownerId : undefined,
      data: {
        name: props.finalData.data.name,
        email: props.finalData.data.email,
        phone: props.finalData.data.phone,
        address: props.finalData.data.address,
        canDriveVehicleTypes: props.finalData.data.canDriveVehicleTypes,
        defaultAllowancePerDay: props.finalData.data.defaultAllowancePerDay,
        licenseNumber: props.finalData.data.licenseNumber,
        licenseExpiresOn: props.finalData.data.licenseExpiresOn,
        licensePhotos: props.finalData.data.licensePhotos,
        userPhotos: props.finalData.data.userPhotos,
      },
    }
    const addedDriver = await addDriverAction(newDriverData)
    if (addedDriver) {
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
          <ConfirmValues
            name={t("DriverName")}
            value={props.finalData.data.name}
          />
          <ConfirmValues
            name={t("DriverPhone")}
            value={props.finalData.data.phone}
          />
          <ConfirmValues
            name={t("DriverEmail")}
            value={props.finalData.data.email}
          />
          <ConfirmValues
            name={t("LicenseNumber")}
            value={props.finalData.data.licenseNumber}
          />
          {props.finalData.data.licenseExpiresOn && (
            <ConfirmValues
              name={t("LicenseExpiresOn")}
              value={props.finalData.data.licenseExpiresOn.toDateString()}
            />
          )}
          <ConfirmValues
            name={t("DriverAddress")}
            value={props.finalData.data.address}
          />
          <ConfirmValues
            name={t("CanDriveVehicleTypes")}
            value={props.finalData.data.canDriveVehicleTypes.join(", ")}
          />
          {props.finalData.data.defaultAllowancePerDay && (
            <ConfirmValues
              name={t("DefaultAllowancePerDay")}
              value={`${props.finalData.data.defaultAllowancePerDay}`}
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
