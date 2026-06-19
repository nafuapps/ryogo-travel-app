"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  Building2,
  Car,
  LifeBuoy,
  MonitorPlay,
  ShieldCheck,
  UserKey,
} from "lucide-react"
import { RyogoH1, RyogoP } from "@/components/typography"
import { SlideshowItemType, SlideshowWrapper } from "../slideshowWrapper"
import { useTranslations } from "next-intl"

export default function HowItWorksEntitiesSection() {
  const t = useTranslations("Landing.HowItWorks.Entities")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Entities0.png",
      icon: Building2,
      title: t("E0.Title"),
      description: t("E0.Description"),
    },
    {
      src: "/Entities1.png",
      icon: ShieldCheck,
      title: t("E1.Title"),
      description: t("E1.Description"),
    },
    {
      src: "/Entities2.png",
      icon: Car,
      title: t("E2.Title"),
      description: t("E2.Description"),
    },
    {
      src: "/Entities3.png",
      icon: LifeBuoy,
      title: t("E3.Title"),
      description: t("E3.Description"),
    },
    {
      src: "/Entities4.png",
      icon: UserKey,
      title: t("E4.Title"),
      description: t("E4.Description"),
    },
    {
      src: "/Entities5.png",
      icon: MonitorPlay,
      title: t("E5.Title"),
      description: t("E5.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="entities" className="min-h-lvh bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} />
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
