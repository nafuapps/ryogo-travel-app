"use client"

import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
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
  Blocks,
  Car,
  ChevronRight,
  Settings2,
  Share2,
  Tickets,
  Workflow,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function HomeWorkingSection() {
  const t = useTranslations("Landing.Home.Working")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/home/fleet.png",
      icon: Car,
      title: t("W0.Title"),
      description: t("W0.Description"),
    },
    {
      src: "/home/booking.png",
      icon: Tickets,
      title: t("W1.Title"),
      description: t("W1.Description"),
    },
    {
      src: "/home/connect.png",
      icon: Workflow,
      title: t("W2.Title"),
      description: t("W2.Description"),
    },
    {
      src: "/home/share.png",
      icon: Share2,
      title: t("W3.Title"),
      description: t("W3.Description"),
    },
    {
      src: "/home/reconcile.png",
      icon: Blocks,
      title: t("W4.Title"),
      description: t("W4.Description"),
    },
    {
      src: "/home/control.png",
      icon: Settings2,
      title: t("W5.Title"),
      description: t("W5.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="working">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} />
        <Link href="/how-it-works" prefetch={false}>
          <RyogoDefaultButton
            size="lg"
            label={t("MoreCTA")}
            className="w-full md:w-auto"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </RyogoDefaultButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
