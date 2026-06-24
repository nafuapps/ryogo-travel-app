"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { FAQItem, FAQWrapper } from "@/components/flows/landing/faqWrapper"

export default function FeaturesFAQSection() {
  const t = useTranslations("Landing.Features.FAQ")
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
          <FAQItem question={t("Q1.Question")} answer={t("Q1.Answer")} />
          <FAQItem question={t("Q2.Question")} answer={t("Q2.Answer")} />
          <FAQItem question={t("Q3.Question")} answer={t("Q3.Answer")} />
          <FAQItem question={t("Q4.Question")} answer={t("Q4.Answer")} />
          <FAQItem question={t("Q5.Question")} answer={t("Q5.Answer")} />
          <FAQItem question={t("Q6.Question")} answer={t("Q6.Answer")} />
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
