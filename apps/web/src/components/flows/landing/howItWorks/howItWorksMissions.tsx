"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoH1, RyogoP } from "@/components/typography"
import {
  SlideshowItemType,
  SlideshowWrapper,
} from "@/components/flows/landing/slideshowWrapper"
import {
  BellPlus,
  CalendarClock,
  Megaphone,
  MessageCircleWarning,
} from "lucide-react"
import { useTranslations } from "next-intl"

export default function HowItWorksMissionsSection() {
  const t = useTranslations("Landing.HowItWorks.Missions")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Missions0.png",
      icon: MessageCircleWarning,
      title: t("M0.Title"),
      description: t("M0.Description"),
    },
    {
      src: "/Missions1.png",
      icon: CalendarClock,
      title: t("M1.Title"),
      description: t("M1.Description"),
    },
    {
      src: "/Missions2.png",
      icon: BellPlus,
      title: t("M2.Title"),
      description: t("M2.Description"),
    },
    {
      src: "/Missions3.png",
      icon: Megaphone,
      title: t("M3.Title"),
      description: t("M3.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="missions" className=" bg-sky-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} reverse />
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
