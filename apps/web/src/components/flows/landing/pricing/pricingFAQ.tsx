import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { FAQItem, FAQWrapper } from "@/components/flows/landing/faqWrapper"
import { getTranslations } from "next-intl/server"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default async function PricingFAQSection() {
  const t = await getTranslations("Landing.Pricing.FAQ")
  return (
    <LandingSectionWrapper id="faq">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <FAQWrapper>
          <FAQItem
            question={t("TrialEnd.Question")}
            answer={t("TrialEnd.Answer")}
          />
          <FAQItem
            question={t("Upgrade.Question")}
            answer={t("Upgrade.Answer", { contact: SUPPORT_EMAIL })}
          />
          <FAQItem
            question={t("PaymentMethod.Question")}
            answer={t("PaymentMethod.Answer")}
          />
          <FAQItem
            question={t("Cancel.Question")}
            answer={t("Cancel.Answer")}
          />
          <FAQItem
            question={t("DataDowngrade.Question")}
            answer={t("DataDowngrade.Answer")}
          />
          <FAQItem
            question={t("SpecialPricing.Question")}
            answer={t("SpecialPricing.Answer", { contact: SUPPORT_EMAIL })}
          />
        </FAQWrapper>
        <Link href="/resources">
          <RyogoDefaultButton
            size="lg"
            label={t("MoreCTA")}
            className="w-full md:w-auto"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </RyogoDefaultButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
