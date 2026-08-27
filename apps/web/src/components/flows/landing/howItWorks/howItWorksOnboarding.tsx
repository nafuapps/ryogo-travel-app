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
import Link from "next/link"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  Building2,
  Car,
  ChevronDown,
  LifeBuoy,
  MonitorPlay,
  ShieldCheck,
  UserKey,
} from "lucide-react"
import { useTranslations } from "next-intl"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"

export default function HowItWorksOnboardingSection() {
  const t = useTranslations("Landing.HowItWorks.Onboarding")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Onboarding0.png",
      icon: Building2,
      title: t("O0.Title"),
      description: t("O0.Description"),
    },
    {
      src: "/Onboarding1.png",
      icon: ShieldCheck,
      title: t("O1.Title"),
      description: t("O1.Description"),
    },
    {
      src: "/Onboarding2.png",
      icon: Car,
      title: t("O2.Title"),
      description: t("O2.Description"),
    },
    {
      src: "/Onboarding3.png",
      icon: LifeBuoy,
      title: t("O3.Title"),
      description: t("O3.Description"),
    },
    {
      src: "/Onboarding4.png",
      icon: UserKey,
      title: t("O4.Title"),
      description: t("O4.Description"),
    },
    {
      src: "/Onboarding5.png",
      icon: MonitorPlay,
      title: t("O5.Title"),
      description: t("O5.Description"),
    },
  ]

  return (
    <LandingSectionWrapper
      id="onboarding"
      className=" bg-white dark:bg-slate-950"
    >
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <SlideshowWrapper items={items} />
        <Link href="/auth/signup">
          <RyogoDefaultButton
            size="lg"
            className="w-full md:w-auto"
            label={t("MoreCTA")}
          />
        </Link>
        <Link href="#bookings">
          <RyogoGhostButton
            size="lg"
            label={t("ContinueCTA")}
            labelColor="light"
            className="gap-1 lg:gap-1.5 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
          >
            <RyogoIcon icon={ChevronDown} size="sm" color="light" thick />
          </RyogoGhostButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
