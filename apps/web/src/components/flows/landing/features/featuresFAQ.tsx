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

export default async function FeaturesFAQSection() {
  const t = await getTranslations("Landing.Features.FAQ")
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
            question={t("Reassign.Question")}
            answer={t("Reassign.Answer")}
          />
          <FAQItem question={t("PWA.Question")} answer={t("PWA.Answer")} />
          <FAQItem
            question={t("AccessAnalytics.Question")}
            answer={t("AccessAnalytics.Answer")}
          />
          <FAQItem
            question={t("Alerts.Question")}
            answer={t("Alerts.Answer")}
          />
          <FAQItem
            question={t("Conflict.Question")}
            answer={t("Conflict.Answer")}
          />
          <FAQItem
            question={t("Status.Question")}
            answer={t("Status.Answer")}
          />
          <FAQItem
            question={t("Payment.Question")}
            answer={t("Payment.Answer")}
          />
          <FAQItem
            question={t("TripSheet.Question")}
            answer={t("TripSheet.Answer")}
          />
          <FAQItem
            question={t("BookingConfirmation.Question")}
            answer={t("BookingConfirmation.Answer")}
          />
          <FAQItem
            question={t("TrackingLink.Question")}
            answer={t("TrackingLink.Answer")}
          />
          <FAQItem
            question={t("Languages.Question")}
            answer={t("Languages.Answer")}
          />
          <FAQItem
            question={t("LeaveRepair.Question")}
            answer={t("LeaveRepair.Answer")}
          />
          <FAQItem
            question={t("Transactions.Question")}
            answer={t("Transactions.Answer")}
          />
          <FAQItem
            question={t("Expenses.Question")}
            answer={t("Expenses.Answer")}
          />
          <FAQItem
            question={t("DataPrivacy.Question")}
            answer={t("DataPrivacy.Answer")}
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
