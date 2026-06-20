"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

export default function PricingFAQSection() {
  const t = useTranslations("Landing.Pricing.FAQ")
  return (
    <LandingSectionWrapper id="faq" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <div className="flex flex-col justify-center divide-y items-center w-full max-w-4xl">
          <PricingFAQItem question={t("Q1.Question")} answer={t("Q1.Answer")} />
          <PricingFAQItem
            question={t("Q2.Question")}
            answer={t("Q2.Answer", { contact: SUPPORT_EMAIL })}
          />
          <PricingFAQItem question={t("Q3.Question")} answer={t("Q3.Answer")} />
          <PricingFAQItem question={t("Q4.Question")} answer={t("Q4.Answer")} />
          <PricingFAQItem question={t("Q5.Question")} answer={t("Q5.Answer")} />
          <PricingFAQItem
            question={t("Q6.Question")}
            answer={t("Q6.Answer", { contact: SUPPORT_EMAIL })}
          />
        </div>
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

function PricingFAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-3 lg:gap-4 w-full py-5 lg:py-6">
      <div
        className="flex items-center gap-2.5 lg:gap-3"
        onClick={() => setOpen(!open)}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition rounded-lg bg-slate-100 p-1.5 lg:p-2 ${
            open ? "" : "-rotate-90"
          }`}
        >
          <RyogoIcon color="black" size="sm" icon={ChevronDown} thick />
        </div>

        <RyogoP weight="font-bold">{question}</RyogoP>
      </div>
      {open && <RyogoSmall color="slate">{answer}</RyogoSmall>}
    </div>
  )
}
