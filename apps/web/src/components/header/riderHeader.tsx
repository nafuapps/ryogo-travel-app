"use client"

import {
  HeaderLeftWrapper,
  HeaderRightWrapper,
  HeaderWrapper,
} from "@/components/header/headerWrappers"
import { RyogoP } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Target } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import HeaderButton from "./headerButton"

export default function RiderHeader({ pathName }: { pathName: string }) {
  const t = useTranslations("Rider.Header")

  const titleKey = ("Title." + pathName || "Title./rider") as Parameters<
    typeof t
  >[0]
  const title = t(titleKey)

  return (
    <HeaderWrapper>
      <HeaderLeftWrapper>
        <SidebarTrigger />
        <RyogoP>{title}</RyogoP>
      </HeaderLeftWrapper>
      <HeaderRightWrapper>
        <Link href="/rider/myActions">
          <HeaderButton label={t("ActionCenter")} icon={Target} />
        </Link>
      </HeaderRightWrapper>
    </HeaderWrapper>
  )
}
