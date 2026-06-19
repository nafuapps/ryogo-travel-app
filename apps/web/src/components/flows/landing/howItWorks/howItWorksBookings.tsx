"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  Building2,
  Car,
  ChevronRight,
  LifeBuoy,
  MonitorPlay,
  ShieldCheck,
  UserKey,
} from "lucide-react"
import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { SlideshowItemType, SlideshowWrapper } from "../slideshowWrapper"
import { useTranslations } from "next-intl"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HowItWorksBookingsSection() {
  const t = useTranslations("Landing.HowItWorks.Bookings")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Bookings0.png",
      icon: Building2,
      title: t("B0.Title"),
      description: t("B0.Description"),
    },
    {
      src: "/Bookings1.png",
      icon: ShieldCheck,
      title: t("B1.Title"),
      description: t("B1.Description"),
    },
    {
      src: "/Bookings2.png",
      icon: Car,
      title: t("B2.Title"),
      description: t("B2.Description"),
    },
    {
      src: "/Bookings3.png",
      icon: LifeBuoy,
      title: t("B3.Title"),
      description: t("B3.Description"),
    },
    {
      src: "/Bookings4.png",
      icon: UserKey,
      title: t("B4.Title"),
      description: t("B4.Description"),
    },
    {
      src: "/Bookings5.png",
      icon: MonitorPlay,
      title: t("B5.Title"),
      description: t("B5.Description"),
    },
    {
      src: "/Bookings6.png",
      icon: MonitorPlay,
      title: t("B6.Title"),
      description: t("B6.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="bookings" className="min-h-lvh bg-sky-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} reverse />
        <Link href="/auth/signup">
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
