import { H3Grey } from "@/components/typography"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ConfirmValues from "../components/confirmValues"
import { CreateAccountFormDataType } from "@ryogo-travel-app/api/types/formDataTypes"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
  OnboardingStepSecondaryAction,
} from "../components/onboardingSteps"
import { Form } from "@/components/ui/form"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { loginAction } from "@/app/auth/login/password/[userId]/loginAction"
import { createOwnerAccountAction } from "./createOwnerAccountAction"

export function CreateAccountConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateAccountFormDataType
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Confirm")
  const router = useRouter()

  const formData = useForm<CreateAccountFormDataType>()
  //Submit actions
  const onSubmit = async () => {
    // Create Agency and Owner Account
    const newAccountData: CreateOwnerAccountRequestType = {
      agency: {
        businessEmail: props.finalData.agencyEmail,
        businessPhone: props.finalData.agencyPhone,
        businessName: props.finalData.agencyName,
        businessAddress: props.finalData.agencyAddress,
        agencyCity: props.finalData.agencyCity,
        agencyState: props.finalData.agencyState,
        commissionRate: props.finalData.commissionRate,
        logo: props.finalData.agencyLogo,
      },
      owner: {
        email: props.finalData.ownerEmail,
        phone: props.finalData.ownerPhone,
        name: props.finalData.ownerName,
        password: props.finalData.password,
        photos: props.finalData.ownerPhoto,
      },
    }

    const createdOwnerAccount = await createOwnerAccountAction(newAccountData)
    if (createdOwnerAccount.agencyId && createdOwnerAccount.userId) {
      //If success
      //Login the user
      await loginAction(createdOwnerAccount.userId, props.finalData.password)
      //Move to next step
      props.onNext()
    } else {
      //If failed, Take to onboarding page and show error
      toast.error(t("APIError"))
      router.replace("/onboarding")
    }
  }
  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step5Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step5Content">
          <H3Grey>{t("Title")}</H3Grey>
          <ConfirmValues
            name={t("AgencyName")}
            value={props.finalData.agencyName}
          />
          <ConfirmValues
            name={t("OwnerName")}
            value={props.finalData.ownerName}
          />
          <ConfirmValues
            name={t("OwnerPhone")}
            value={props.finalData.ownerPhone}
          />
          <ConfirmValues
            name={t("OwnerEmail")}
            value={props.finalData.ownerEmail}
          />
          <ConfirmValues
            name={t("AgencyPhone")}
            value={props.finalData.agencyPhone}
          />
          <ConfirmValues
            name={t("AgencyEmail")}
            value={props.finalData.agencyEmail}
          />
          <ConfirmValues
            name={t("AgencyAddress")}
            value={props.finalData.agencyAddress}
          />
          <ConfirmValues
            name={t("Location")}
            value={`${props.finalData.agencyCity}, ${props.finalData.agencyState}`}
          />
          {props.finalData.commissionRate && (
            <ConfirmValues
              name={t("CommissionRate")}
              value={`${props.finalData.commissionRate}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step5Actions">
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
