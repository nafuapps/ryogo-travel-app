"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { useTranslations } from "next-intl"
import {
  SlideshowItemType,
  SlideshowWrapper,
} from "@/components/flows/landing/slideshowWrapper"
import { Building2, Car, LifeBuoy, ShieldCheck, UserKey } from "lucide-react"
import { RyogoH1, RyogoP } from "@/components/typography"

export default function HowItWorksDriverAppSection() {
  const t = useTranslations("Landing.HowItWorks.DriverApp")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/DriverApp0.png",
      icon: Building2,
      title: t("D0.Title"),
      description: t("D0.Description"),
    },
    {
      src: "/DriverApp1.png",
      icon: ShieldCheck,
      title: t("D1.Title"),
      description: t("D1.Description"),
    },
    {
      src: "/DriverApp2.png",
      icon: Car,
      title: t("D2.Title"),
      description: t("D2.Description"),
    },
    {
      src: "/DriverApp3.png",
      icon: LifeBuoy,
      title: t("D3.Title"),
      description: t("D3.Description"),
    },
    {
      src: "/DriverApp4.png",
      icon: UserKey,
      title: t("D4.Title"),
      description: t("D4.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="driverApp" className="min-h-lvh bg-sky-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
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
