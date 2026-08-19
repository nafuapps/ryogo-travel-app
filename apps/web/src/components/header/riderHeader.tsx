"use client"

import {
  HeaderLeftWrapper,
  HeaderRightWrapper,
  HeaderWrapper,
} from "@/components/header/headerWrappers"
import { RyogoSmall } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Target } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import HeaderButton, { HeaderBackButton } from "./headerButton"

export default function RiderHeader({ pathName }: { pathName: string }) {
  const t = useTranslations("Rider.Header")

  const titleKey = ("Title." + pathName || "Title./rider") as Parameters<
    typeof t
  >[0]
  const title = t(titleKey)

  return (
    <HeaderWrapper>
      <HeaderLeftWrapper>
        <HeaderBackButton />
        <SidebarTrigger />
        <RyogoSmall weight="font-bold" color="slate">
          {title}
        </RyogoSmall>
      </HeaderLeftWrapper>
      <HeaderRightWrapper>
        <Link href="/rider/myMissions">
          <HeaderButton label={t("MissionControl")} icon={Target} />
        </Link>
      </HeaderRightWrapper>
    </HeaderWrapper>
  )
}
