"use client"

import { RyogoH3 } from "@/components/typography"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ConfirmValues from "@/components/form/confirmValues"
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
} from "@/components/flows/onboarding/onboardingSteps"
import { Form } from "@/components/ui/form"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createOwnerAccountAction } from "@/app/actions/users/createOwnerAccountAction"
import { Dispatch, SetStateAction } from "react"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export function CreateAccountConfirm({
  onNext,
  onPrev,
  finalData,
  updateFinalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: CreateOwnerAccountRequestType
  updateFinalData: Dispatch<SetStateAction<CreateOwnerAccountRequestType>>
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Confirm")
  const router = useRouter()

  const formData = useForm<CreateOwnerAccountRequestType>()

  const onSubmit = async () => {
    // Create Agency and Owner Account
    const newAccountData: CreateOwnerAccountRequestType = {
      agency: {
        businessEmail: finalData.agency.businessEmail,
        businessPhone: finalData.agency.businessPhone,
        businessName: finalData.agency.businessName,
        businessAddress: finalData.agency.businessAddress,
        agencyCity: finalData.agency.agencyCity,
        agencyState: finalData.agency.agencyState,
        commissionRate: finalData.agency.commissionRate,
        logo: finalData.agency.logo,
        qrCode: finalData.agency.qrCode,
        tryPremium: finalData.agency.tryPremium,
      },
      owner: {
        email: finalData.owner.email,
        phone: finalData.owner.phone,
        name: finalData.owner.name,
        password: finalData.owner.password,
        photos: finalData.owner.photos,
      },
    }

    const createdOwnerAccount = await createOwnerAccountAction(newAccountData)
    if (createdOwnerAccount) {
      //If success, update userid and move to next success page
      updateFinalData({
        agency: {
          ...finalData.agency,
        },
        owner: {
          ...finalData.owner,
          id: createdOwnerAccount.userId,
        },
      })
      onNext()
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
          <RyogoH3 color="slate">{t("Title")}</RyogoH3>
          <ConfirmValues
            name={t("AgencyName")}
            value={finalData.agency.businessName}
          />
          <ConfirmValues name={t("OwnerName")} value={finalData.owner.name} />
          <ConfirmValues name={t("OwnerPhone")} value={finalData.owner.phone} />
          <ConfirmValues name={t("OwnerEmail")} value={finalData.owner.email} />
          <ConfirmValues
            name={t("AgencyPhone")}
            value={finalData.agency.businessPhone}
          />
          <ConfirmValues
            name={t("AgencyEmail")}
            value={finalData.agency.businessEmail}
          />
          <ConfirmValues
            name={t("AgencyAddress")}
            value={finalData.agency.businessAddress}
          />
          <ConfirmValues
            name={t("Location")}
            value={`${finalData.agency.agencyCity}, ${finalData.agency.agencyState}`}
          />
          {finalData.agency.commissionRate && (
            <ConfirmValues
              name={t("CommissionRate")}
              value={`${finalData.agency.commissionRate}`}
            />
          )}
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step5Actions">
          <RyogoDefaultButton
            className="w-full"
            type="submit"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
          <RyogoOutlineButton
            size={"lg"}
            type="button"
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
