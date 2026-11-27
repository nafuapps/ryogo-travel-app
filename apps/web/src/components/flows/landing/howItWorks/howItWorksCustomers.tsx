"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  SlideshowItemType,
  SlideshowWrapper,
} from "@/components/flows/landing/slideshowWrapper"
import { RyogoCaption, RyogoH1, RyogoP } from "@/components/typography"
import {
  BanknoteArrowUp,
  CalendarSync,
  ListPlus,
  QrCode,
  SquareArrowOutUpRight,
} from "lucide-react"
import { useTranslations } from "next-intl"

export default function HowItWorksCustomersSection() {
  const t = useTranslations("Landing.HowItWorks.Customers")

  const items: SlideshowItemType[] = [
    {
      src: "/how_it_works/customers/manage.webm",
      icon: ListPlus,
      title: t("C0.Title"),
      description: t("C0.Description"),
    },
    {
      src: "/how_it_works/customers/update.webm",
      icon: CalendarSync,
      title: t("C1.Title"),
      description: t("C1.Description"),
    },
    {
      src: "/how_it_works/customers/share.webm",
      icon: SquareArrowOutUpRight,
      title: t("C2.Title"),
      description: t("C2.Description"),
    },
    {
      src: "/how_it_works/customers/paid.webm",
      icon: QrCode,
      title: t("C3.Title"),
      description: t("C3.Description"),
    },
    {
      src: "/how_it_works/customers/transactions.webm",
      icon: BanknoteArrowUp,
      title: t("C4.Title"),
      description: t("C4.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="customers">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} />
        <RyogoCaption color="light" className="text-center max-w-4xl">
          {t("Disclaimer")}
        </RyogoCaption>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
