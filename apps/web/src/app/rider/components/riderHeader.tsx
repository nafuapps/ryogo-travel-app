"use client"

import {
  headerButtonClassName,
  headerClassName,
  headerIconClassName,
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
import { LucideTarget } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function RiderHeader() {
  const t = useTranslations("Rider.Header")
  const pathname = usePathname()

  const titleKey = ("Title." + pathname || "Title./rider") as Parameters<
    typeof t
  >[0]

  return (
    <div id="RiderHeader" className={headerClassName}>
      <div id="HeaderLeft" className={headerLeftClassName}>
        <SidebarTrigger />
        <H5>{t(titleKey)}</H5>
      </div>
      <div id="HeaderRight" className={headerRightClassName}>
        <Link href="/rider/myActions">
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"default"}>
                <span className={headerButtonClassName}>
                  <CaptionGrey>{t("ActionCenter")}</CaptionGrey>
                </span>
                <LucideTarget className={headerIconClassName} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={headerTooltipClassName}>
              {t("ActionCenter")}
            </TooltipContent>
          </Tooltip>
        </Link>
      </div>
    </div>
  )
}
