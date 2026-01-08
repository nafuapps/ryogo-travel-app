import { H3, H5, P, CaptionGrey, PGrey } from "@/components/typography"
import { useTranslations } from "next-intl"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { NewDriverFormDataType } from "./newDriverForm"

export function NewDriverFinish(props: {
  newDriverFormData: NewDriverFormDataType
}) {
  const t = useTranslations("Onboarding.AddDriverPage.Finish")
  const router = useRouter()

  return (
    <OnboardingStepFinishForm formId="Step6Form">
      <OnboardingStepFinishContent contentId="Step6Content">
        <OnboardingSuccessIcon iconId="Step6Icon" />
        <H3>{t("Title")}</H3>
        <H5>{t("Subtitle")}</H5>
        <PGrey>{t("Email", { email: props.finalData.email })}</PGrey>
      </OnboardingStepFinishContent>
      <OnboardingStepActions actionsId="Step6Actions">
        <P>{t("Description1")}</P>
        <CaptionGrey>{t("Description2")}</CaptionGrey>
        <OnboardingStepPrimaryAction disabled={false}>
          <Link href="/onboarding/add-agent">{t("PrimaryCTA")}</Link>
        </OnboardingStepPrimaryAction>
        <OnboardingStepSecondaryAction
          onClick={() => {
            router.replace("/dashboard")
          }}
          disabled={false}
        >
          {t("SecondaryCTA")}
        </OnboardingStepSecondaryAction>
      </OnboardingStepActions>
    </OnboardingStepFinishForm>
  )
}
