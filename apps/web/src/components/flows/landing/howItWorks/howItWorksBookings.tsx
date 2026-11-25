"use client"

import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  SlideshowItemType,
  SlideshowWrapper,
} from "@/components/flows/landing/slideshowWrapper"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
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
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function HowItWorksBookingsSection() {
  const t = useTranslations("Landing.HowItWorks.Bookings")

  const items: SlideshowItemType[] = [
    {
      src: "/how_it_works/bookings/creation.webm",
      icon: PackagePlus,
      title: t("B0.Title"),
      description: t("B0.Description"),
    },
    {
      src: "/how_it_works/bookings/assignment.webm",
      icon: Pin,
      title: t("B1.Title"),
      description: t("B1.Description"),
    },
    {
      src: "/how_it_works/bookings/recommendations.webm",
      icon: BadgeInfo,
      title: t("B2.Title"),
      description: t("B2.Description"),
    },
    {
      src: "/how_it_works/bookings/send.webm",
      icon: MessageSquareShare,
      title: t("B3.Title"),
      description: t("B3.Description"),
    },
    {
      src: "/how_it_works/bookings/manage.webm",
      icon: MapPinPen,
      title: t("B4.Title"),
      description: t("B4.Description"),
    },
    {
      src: "/how_it_works/bookings/add.webm",
      icon: Coins,
      title: t("B5.Title"),
      description: t("B5.Description"),
    },
    {
      src: "/how_it_works/bookings/reconcile.webm",
      icon: ScanSearch,
      title: t("B6.Title"),
      description: t("B6.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="bookings" className="bg-sky-50 dark:bg-sky-950">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} reverse />
        <Link href="/auth/signup" prefetch={false}>
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
            className="gap-1 lg:gap-1.5 hover:bg-sky-100 dark:hover:bg-sky-900"
          >
            <RyogoIcon icon={ChevronDown} size="sm" color="light" thick />
          </RyogoGhostButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
