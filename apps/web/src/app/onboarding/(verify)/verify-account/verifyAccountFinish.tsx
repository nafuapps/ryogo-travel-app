import { RyogoH3, RyogoP, RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { verifyAccountAction } from "@/app/actions/users/verifyAccountAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { useForm } from "react-hook-form"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { Check } from "lucide-react"

export function VerifyAccountFinish() {
  const t = useTranslations("Onboarding.VerifyAccountPage.Finish")
  const router = useRouter()
  const form = useForm()

  const onSubmit = async () => {
    //Verify user in cookies and take to vehicle onboarding
    await verifyAccountAction()
    router.push("/onboarding/add-vehicle")
  }

  return (
    <FormWrapper
      id="Step2Form"
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      justifyCenter
    >
      <FormContentWrapper asCard={false}>
        <RyogoEnclosedIcon
          icon={Check}
          size="md"
          color="white"
          bgColor="black"
          circular
        />
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoP>{t("Subtitle")}</RyogoP>
      </FormContentWrapper>
      <StickyActionWrapper>
        <RyogoP>{t("Description1")}</RyogoP>
        <RyogoCaption color="light">{t("Description2")}</RyogoCaption>
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
