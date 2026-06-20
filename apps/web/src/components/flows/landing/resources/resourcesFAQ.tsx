import { RyogoP, RyogoH1 } from "@/components/typography"
import { useTranslations } from "next-intl"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"

const faqs = [
  {
    id: "1",
    question: "How do I book a trip on RyoGo?",
    answer:
      "Booking a trip is simple! Just sign up for an account, search for your destination, select your travel dates, and complete the booking process. Our platform will guide you through each step.",
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, digital wallets (Apple Pay, Google Pay), and bank transfers. All payments are secured with SSL encryption.",
  },
  {
    id: "3",
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes! You can cancel or modify your booking through your account dashboard. Standard plans allow one free modification. Premium members get flexible cancellation policies with extended deadlines.",
  },
  {
    id: "4",
    question: "What is the RyoGo rewards program?",
    answer:
      "Earn 1 point for every dollar spent on bookings. Accumulate points to redeem for discounts on future trips, free upgrades, or travel credits. Premium members earn double points!",
  },
  {
    id: "5",
    question: "Is my personal information safe?",
    answer:
      "Absolutely. We use bank-level encryption (SSL/TLS) to protect all data. Your information is never shared with third parties without your consent. We comply with all international data protection regulations.",
  },
  {
    id: "6",
    question: "What support options are available?",
    answer:
      "We offer email support for free members, priority email support for Professional members, and 24/7 phone and chat support for Premium members. We're always here to help!",
  },
]

export default function ResourcesFAQSection() {
  const t = useTranslations("Landing.Resources.FAQ")
  return (
    <LandingSectionWrapper id="faq" className="bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
