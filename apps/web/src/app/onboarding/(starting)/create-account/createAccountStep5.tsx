"use client"

import { RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { CreateOwnerAccountRequestType } from "@ryogo-travel-app/api/types/user.types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createOwnerAccountAction } from "@/app/actions/users/createOwnerAccountAction"
import { Dispatch, SetStateAction } from "react"
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
    <FormWrapper
      id="Step5Form"
      form={formData}
      onSubmit={formData.handleSubmit(onSubmit)}
    >
      <FormContentWrapper asCard={false}>
        <RyogoP color="slate">{t("Title")}</RyogoP>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("Agency")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            <DetailsLineItem
              label={t("AgencyName")}
              value={finalData.agency.businessName}
            />
            <DetailsLineItem
              label={t("AgencyPhone")}
              value={finalData.agency.businessPhone}
            />
            <DetailsLineItem
              label={t("AgencyEmail")}
              value={finalData.agency.businessEmail}
            />
            <DetailsLineItem
              label={t("AgencyAddress")}
              value={finalData.agency.businessAddress}
            />
            <DetailsLineItem
              label={t("Location")}
              value={`${finalData.agency.agencyCity}, ${finalData.agency.agencyState}`}
            />
            {finalData.agency.commissionRate && (
              <DetailsLineItem
                label={t("CommissionRate")}
                value={`${finalData.agency.commissionRate}`}
              />
            )}
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
        <DetailsBorderWrapper>
          <DetailsHeaderWrapper>
            <RyogoCaption color="light">{t("Owner")}</RyogoCaption>
          </DetailsHeaderWrapper>
          <DetailsContentWrapper>
            <DetailsLineItem
              label={t("OwnerName")}
              value={finalData.owner.name}
            />
            <DetailsLineItem
              label={t("OwnerPhone")}
              value={finalData.owner.phone}
            />
            <DetailsLineItem
              label={t("OwnerEmail")}
              value={finalData.owner.email}
            />
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
      </FormContentWrapper>
      <StickyActionWrapper>
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
          type="button"
          onClick={onPrev}
          className="w-full"
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
