import { verifyOwnerAccountAction } from "@/app/actions/users/verifyOwnerAccountAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH4, RyogoSmall } from "@/components/typography"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

export function VerifyAccountFinish({ agencyId }: { agencyId: string }) {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")
  const router = useRouter()
  const form = useForm()

  const onSubmit = async () => {
    //Verify user in cookies and take to vehicle onboarding
    await verifyOwnerAccountAction(agencyId)
    router.push("/onboarding/add-vehicle")
  }

  return (
    <FormWrapper
      id="Step2Form"
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      justifyCenter
    >
      <FormContentWrapper
        asCard={false}
        className="grow justify-center items-center"
      >
        <RyogoEnclosedIcon
          icon={Check}
          size="md"
          color="white"
          bgColor="black"
          circular
          className="animate-caret-blink"
        />
        <RyogoH4 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH4>
        <RyogoSmall color="light" className="text-center">
          {t("Subtitle")}
        </RyogoSmall>
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoSmall className="text-center">{t("Description1")}</RyogoSmall>
        <RyogoCaption color="light" className="text-center">
          {t("Description2")}
        </RyogoCaption>
        <RyogoDefaultButton
          size={"lg"}
          type="submit"
          disabled={form.formState.isSubmitting}
          label={t("PrimaryCTA")}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
