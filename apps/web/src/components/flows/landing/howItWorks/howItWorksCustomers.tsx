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

export default function HowItWorksCustomersSection() {
  const t = useTranslations("Landing.HowItWorks.Customers")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Customers0.png",
      icon: Building2,
      title: t("C0.Title"),
      description: t("C0.Description"),
    },
    {
      src: "/Customers1.png",
      icon: ShieldCheck,
      title: t("C1.Title"),
      description: t("C1.Description"),
    },
    {
      src: "/Customers2.png",
      icon: Car,
      title: t("C2.Title"),
      description: t("C2.Description"),
    },
    {
      src: "/Customers3.png",
      icon: LifeBuoy,
      title: t("C3.Title"),
      description: t("C3.Description"),
    },
    {
      src: "/Customers4.png",
      icon: UserKey,
      title: t("C4.Title"),
      description: t("C4.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="customers" className=" bg-white">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
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
