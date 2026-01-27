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
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function RiderHeader({ pathName }: { pathName: string }) {
  const t = await getTranslations("Rider.Header")

  const titleKey = ("Title." + pathName || "Title./rider") as Parameters<
    typeof t
  >[0]
  const title = t(titleKey)

  return (
    <div id="RiderHeader" className={headerClassName}>
      <div id="HeaderLeft" className={headerLeftClassName}>
        <SidebarTrigger />
        <H5>{title}</H5>
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
