import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { FAQItem, FAQWrapper } from "@/components/flows/landing/faqWrapper"
import { getTranslations } from "next-intl/server"

export default async function HowItWorksFAQSection() {
  const t = await getTranslations("Landing.HowItWorks.FAQ")
  return (
    <LandingSectionWrapper id="faq" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
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
          <Button size="lg" className="w-full md:w-auto">
            <RyogoSmall color="white" weight="font-medium">
              {t("MoreCTA")}
            </RyogoSmall>
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </Button>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
