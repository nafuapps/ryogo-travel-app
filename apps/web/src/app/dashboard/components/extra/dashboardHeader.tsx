import {
  headerButtonClassName,
  headerClassName,
  headerIconClassName,
  headerLeftClassName,
  headerRightClassName,
  headerTooltipClassName,
} from "@/components/header/headerCommon"
import { H5, SmallGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LucidePlus, LucideTarget } from "lucide-react"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function DashboardHeader(props: { pathName: string }) {
  const t = await getTranslations("Dashboard.Header")

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
                <Button variant="outline" size={"lg"}>
                  <LucidePlus className={headerIconClassName} />
                  <span className={headerButtonClassName}>
                    <SmallGrey>{t("NewBooking")}</SmallGrey>
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
                <Button variant="outline" size={"lg"}>
                  <span className={headerButtonClassName}>
                    <SmallGrey>{t("ActionCenter")}</SmallGrey>
                  </span>
                  <LucideTarget className={headerIconClassName} />
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
