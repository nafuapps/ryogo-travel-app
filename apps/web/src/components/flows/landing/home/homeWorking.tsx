"use client"

import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Blocks,
  Car,
  ChevronRight,
  Settings2,
  Share2,
  Tickets,
  Workflow,
} from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { SlideshowWrapper } from "@/components/flows/landing/slideshowWrapper"
import { useTranslations } from "next-intl"

export default function HomeWorkingSection() {
  const t = useTranslations("Landing.Home.Working")

  //TODO: Add product images
  const items = [
    {
      src: "/homeW0.png",
      icon: Car,
      title: t("W0.Title"),
      description: t("W0.Description"),
    },
    {
      src: "/homeW1.png",
      icon: Tickets,
      title: t("W1.Title"),
      description: t("W1.Description"),
    },
    {
      src: "/homeW2.png",
      icon: Workflow,
      title: t("W2.Title"),
      description: t("W2.Description"),
    },
    {
      src: "/homeW3.png",
      icon: Share2,
      title: t("W3.Title"),
      description: t("W3.Description"),
    },
    {
      src: "/homeW4.png",
      icon: Blocks,
      title: t("W4.Title"),
      description: t("W4.Description"),
    },
    {
      src: "/homeW5.png",
      icon: Settings2,
      title: t("W5.Title"),
      description: t("W5.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="working" className="bg-white min-h-lvh">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" color="dark" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} />
        <Link href="/how-it-works">
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
