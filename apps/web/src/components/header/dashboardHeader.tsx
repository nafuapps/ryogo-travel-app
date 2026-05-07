"use client"

import {
  headerButtonClassName,
  headerClassName,
  headerLeftClassName,
  headerRightClassName,
  headerTooltipClassName,
} from "@/components/header/headerCommon"
import { CaptionGrey, H5 } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus, Target } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default function DashboardHeader(props: { pathName: string }) {
  const t = useTranslations("Dashboard.Header")

  const titleKey = ("Title." + props.pathName ||
    "Title./dashboard") as Parameters<typeof t>[0]
  const title = t(titleKey)

  return (
    <div id="DashboardHeader" className={headerClassName}>
      <div id="HeaderLeft" className={headerLeftClassName}>
        <SidebarTrigger />
        <H5>{title}</H5>
      </div>
      <div id="HeaderRight" className={headerRightClassName}>
        {props.pathName !== "/dashboard/bookings/new" && (
          <Link href="/dashboard/bookings/new">
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button variant="outline" size={"default"}>
                  <RyogoIcon icon={Plus} size="sm" />
                  <span className={headerButtonClassName}>
                    <CaptionGrey>{t("NewBooking")}</CaptionGrey>
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className={headerTooltipClassName}>
                {t("NewBooking")}
              </TooltipContent>
            </Tooltip>
          </Link>
        )}
        {props.pathName !== "/dashboard/action-center" && (
          <Link href="/dashboard/action-center">
            <Tooltip disableHoverableContent>
              <TooltipTrigger asChild>
                <Button variant="outline" size={"default"}>
                  <span className={headerButtonClassName}>
                    <CaptionGrey>{t("ActionCenter")}</CaptionGrey>
                  </span>
                  <RyogoIcon icon={Target} size="sm" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className={headerTooltipClassName}>
                {t("ActionCenter")}
              </TooltipContent>
            </Tooltip>
          </Link>
        )}
      </div>
    </div>
  )
}
