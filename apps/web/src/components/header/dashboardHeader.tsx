"use client"

import {
  HeaderLeftWrapper,
  HeaderRightWrapper,
  HeaderWrapper,
} from "@/components/header/headerWrappers"
import { RyogoSmall } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Target } from "lucide-react"
import { useTranslations } from "next-intl"
import HeaderButton, { HeaderBackButton } from "./headerButton"
import Link from "next/link"

export default function DashboardHeader(props: { pathName: string }) {
  const t = useTranslations("Dashboard.Header")

  const titleKey = ("Title." + props.pathName ||
    "Title./dashboard") as Parameters<typeof t>[0]
  const title = t(titleKey)

  return (
    <HeaderWrapper>
      <HeaderLeftWrapper>
        <SidebarTrigger />
        <HeaderBackButton />
        <RyogoSmall weight="font-bold" color="slate">
          {title}
        </RyogoSmall>
      </HeaderLeftWrapper>
      <HeaderRightWrapper>
        {props.pathName !== "/dashboard/bookings/new" && (
          <Link href="/dashboard/bookings/new">
            <HeaderButton label={t("NewBooking")} icon={Plus} />
          </Link>
        )}
        {props.pathName !== "/dashboard/mission-control" && (
          <Link href="/dashboard/mission-control">
            <HeaderButton label={t("MissionControl")} icon={Target} />
          </Link>
        )}
      </HeaderRightWrapper>
    </HeaderWrapper>
  )
}
