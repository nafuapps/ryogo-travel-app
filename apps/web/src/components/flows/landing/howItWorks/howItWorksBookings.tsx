"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  BadgeInfo,
  ChevronDown,
  Coins,
  MapPinPen,
  MessageSquareShare,
  PackagePlus,
  Pin,
  ScanSearch,
} from "lucide-react"
import { RyogoH1, RyogoP } from "@/components/typography"
import {
  SlideshowItemType,
  SlideshowWrapper,
} from "@/components/flows/landing/slideshowWrapper"
import { useTranslations } from "next-intl"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import Link from "next/link"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"

export default function HowItWorksBookingsSection() {
  const t = useTranslations("Landing.HowItWorks.Bookings")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Bookings0.png",
      icon: PackagePlus,
      title: t("B0.Title"),
      description: t("B0.Description"),
    },
    {
      src: "/Bookings1.png",
      icon: Pin,
      title: t("B1.Title"),
      description: t("B1.Description"),
    },
    {
      src: "/Bookings2.png",
      icon: BadgeInfo,
      title: t("B2.Title"),
      description: t("B2.Description"),
    },
    {
      src: "/Bookings3.png",
      icon: MessageSquareShare,
      title: t("B3.Title"),
      description: t("B3.Description"),
    },
    {
      src: "/Bookings4.png",
      icon: MapPinPen,
      title: t("B4.Title"),
      description: t("B4.Description"),
    },
    {
      src: "/Bookings5.png",
      icon: Coins,
      title: t("B5.Title"),
      description: t("B5.Description"),
    },
    {
      src: "/Bookings6.png",
      icon: ScanSearch,
      title: t("B6.Title"),
      description: t("B6.Description"),
    },
  ]

  return (
    <LandingSectionWrapper
      id="bookings"
      className="bg-sky-100 dark:bg-sky-950/70"
    >
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} reverse />
        <Link href="/auth/signup">
          <RyogoDefaultButton
            size="lg"
            label={t("MoreCTA")}
            className="w-full md:w-auto"
          />
        </Link>
        <Link href="#entities">
          <RyogoGhostButton
            size="lg"
            label={t("ContinueCTA")}
            className="gap-1 lg:gap-1.5 hover:bg-sky-50/80 dark:hover:bg-sky-900/80"
          >
            <RyogoIcon icon={ChevronDown} size="sm" color="light" thick />
          </RyogoGhostButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
