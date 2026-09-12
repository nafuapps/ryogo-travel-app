import { RyogoH4, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import { loginAction } from "@/app/actions/users/loginAction"
import { useRouter } from "next/navigation"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { useForm } from "react-hook-form"
import { PasswordRegex } from "@/lib/regex"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { Check } from "lucide-react"

export function CreateAccountFinish({
  password,
  id,
}: {
  password: string
  id?: string
}) {
  const t = useTranslations("Onboarding.CreateAccountPage.Finish")
  const router = useRouter()
  const form = useForm()

  const onSubmit = async () => {
    if (!id || !PasswordRegex.safeParse(password).success) {
      router.replace("/onboarding")
      return
    }
    //Login the user and take to verification step
    const loginResult = await loginAction(id, password)
    if (loginResult.id) {
      router.replace("/onboarding/verify-account")
    }
  }

  return (
    <FormWrapper
      id="CreateAccountFinishForm"
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
        <RyogoH4 className="text-center">{t("Title")}</RyogoH4>
        <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoSmall className="text-center">{t("Description")}</RyogoSmall>
        <RyogoDefaultButton
          size={"lg"}
          onClick={onSubmit}
          type="submit"
          label={t("PrimaryCTA")}
          disabled={form.formState.isSubmitting}
        />
      </StickyActionWrapper>
    </FormWrapper>
  )
}
