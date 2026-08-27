import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { FAQItem, FAQWrapper } from "@/components/flows/landing/faqWrapper"
import { getTranslations } from "next-intl/server"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default async function HowItWorksFAQSection() {
  const t = await getTranslations("Landing.HowItWorks.FAQ")
  return (
    <LandingSectionWrapper id="faq" className="bg-white dark:bg-slate-950">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <FAQWrapper>
          <FAQItem
            question={t("OnboardingTime.Question")}
            answer={t("OnboardingTime.Answer")}
          />
          <FAQItem
            question={t("Entities.Question")}
            answer={t("Entities.Answer")}
          />
          <FAQItem
            question={t("TechnicalKnowledge.Question")}
            answer={t("TechnicalKnowledge.Answer")}
          />
          <FAQItem
            question={t("WithoutComputer.Question")}
            answer={t("WithoutComputer.Answer")}
          />
          <FAQItem
            question={t("NoAgent.Question")}
            answer={t("NoAgent.Answer")}
          />
          <FAQItem
            question={t("DriverActions.Question")}
            answer={t("DriverActions.Answer")}
          />
          <FAQItem
            question={t("AgentActions.Question")}
            answer={t("AgentActions.Answer")}
          />
          <FAQItem
            question={t("NewBooking.Question")}
            answer={t("NewBooking.Answer")}
          />
        </FAQWrapper>
        <Link href="/resources">
          <RyogoDefaultButton
            size="lg"
            className="w-full md:w-auto"
            label={t("MoreCTA")}
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </RyogoDefaultButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
