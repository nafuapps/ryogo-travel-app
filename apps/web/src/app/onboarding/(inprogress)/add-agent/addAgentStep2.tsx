"use client"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { addAgentAction } from "@/app/actions/users/addAgentAction"
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

export function AddAgentConfirm({
  onNext,
  onPrev,
  finalData,
}: {
  onNext: () => void
  onPrev: () => void
  finalData: AddAgentRequestType
}) {
  const t = useTranslations("Onboarding.AddAgentPage.Confirm")
  const router = useRouter()

  const formData = useForm<AddAgentRequestType>()
  //Submit actions
  const onSubmit = async () => {
    // Add agent
    const newAgentData: AddAgentRequestType = {
      agencyId: finalData.agencyId,
      data: {
        name: finalData.data.name,
        email: finalData.data.email,
        phone: finalData.data.phone,
        photos: finalData.data.photos,
      },
    }
    const addAgent = await addAgentAction(newAgentData)
    if (addAgent) {
      onNext()
    } else {
      //Take to dashboard page and show error
      toast.error(t("APIError"))
      router.replace("/dashboard/home")
    }
  }
  return (
    <FormWrapper
      id="Step2Form"
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
              label={t("AgentName")}
              value={finalData.data.name}
            />
            <DetailsLineItem
              label={t("AgentPhone")}
              value={finalData.data.phone}
            />
            <DetailsLineItem
              label={t("AgentEmail")}
              value={finalData.data.email}
            />
          </DetailsContentWrapper>
        </DetailsBorderWrapper>
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoDefaultButton
          size={"lg"}
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
          disabled={formData.formState.isSubmitting}
          label={t("SecondaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
