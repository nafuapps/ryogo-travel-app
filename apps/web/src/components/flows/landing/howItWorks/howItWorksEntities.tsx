"use client"

import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import {
  BellCheck,
  ClipboardCheck,
  FolderBookmark,
  TreePalm,
  UserCog,
  Wrench,
} from "lucide-react"
import { RyogoH1, RyogoP } from "@/components/typography"
import {
  SlideshowItemType,
  SlideshowWrapper,
} from "@/components/flows/landing/slideshowWrapper"
import { useTranslations } from "next-intl"

export default function HowItWorksEntitiesSection() {
  const t = useTranslations("Landing.HowItWorks.Entities")

  //TODO: Add product images
  const items: SlideshowItemType[] = [
    {
      src: "/Entities0.png",
      icon: UserCog,
      title: t("E0.Title"),
      description: t("E0.Description"),
    },
    {
      src: "/Entities1.png",
      icon: ClipboardCheck,
      title: t("E1.Title"),
      description: t("E1.Description"),
    },
    {
      src: "/Entities2.png",
      icon: BellCheck,
      title: t("E2.Title"),
      description: t("E2.Description"),
    },
    {
      src: "/Entities3.png",
      icon: FolderBookmark,
      title: t("E3.Title"),
      description: t("E3.Description"),
    },
    {
      src: "/Entities4.png",
      icon: TreePalm,
      title: t("E4.Title"),
      description: t("E4.Description"),
    },
    {
      src: "/Entities5.png",
      icon: Wrench,
      title: t("E5.Title"),
      description: t("E5.Description"),
    },
  ]

  return (
    <LandingSectionWrapper id="entities" className="bg-white">
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
