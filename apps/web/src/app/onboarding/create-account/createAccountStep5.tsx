import { H3Grey } from "@/components/typography"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ConfirmValues from "../components/confirmValues"
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
import { loginAction } from "@/app/actions/users/loginAction"
import { createOwnerAccountAction } from "@/app/actions/users/createOwnerAccountAction"

export function CreateAccountConfirm(props: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Confirm")
  const router = useRouter()

  const formData = useForm<CreateOwnerAccountRequestType>()
  //Submit actions
  const onSubmit = async () => {
    // Create Agency and Owner Account
    const newAccountData: CreateOwnerAccountRequestType = {
      agency: {
        businessEmail: props.finalData.agency.businessEmail,
        businessPhone: props.finalData.agency.businessPhone,
        businessName: props.finalData.agency.businessName,
        businessAddress: props.finalData.agency.businessAddress,
        agencyCity: props.finalData.agency.agencyCity,
        agencyState: props.finalData.agency.agencyState,
        commissionRate: props.finalData.agency.commissionRate,
        logo: props.finalData.agency.logo,
      },
      owner: {
        email: props.finalData.owner.email,
        phone: props.finalData.owner.phone,
        name: props.finalData.owner.name,
        password: props.finalData.owner.password,
        photos: props.finalData.owner.photos,
      },
    }

    const createdOwnerAccount = await createOwnerAccountAction(newAccountData)
    if (createdOwnerAccount) {
      //If success
      //Login the user
      await loginAction(
        createdOwnerAccount.userId,
        props.finalData.owner.password,
      )
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
            value={props.finalData.agency.businessName}
          />
          <ConfirmValues
            name={t("OwnerName")}
            value={props.finalData.owner.name}
          />
          <ConfirmValues
            name={t("OwnerPhone")}
            value={props.finalData.owner.phone}
          />
          <ConfirmValues
            name={t("OwnerEmail")}
            value={props.finalData.owner.email}
          />
          <ConfirmValues
            name={t("AgencyPhone")}
            value={props.finalData.agency.businessPhone}
          />
          <ConfirmValues
            name={t("AgencyEmail")}
            value={props.finalData.agency.businessEmail}
          />
          <ConfirmValues
            name={t("AgencyAddress")}
            value={props.finalData.agency.businessAddress}
          />
          <ConfirmValues
            name={t("Location")}
            value={`${props.finalData.agency.agencyCity}, ${props.finalData.agency.agencyState}`}
          />
          {props.finalData.agency.commissionRate && (
            <ConfirmValues
              name={t("CommissionRate")}
              value={`${props.finalData.agency.commissionRate}`}
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
