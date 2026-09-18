import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getOnlineStatus } from "@/lib/utils"
import { CircleSmall } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function UserOnlineStatusComponent({
  lastSeen,
}: {
  lastSeen: Date | null
}) {
  const t = await getTranslations("Dashboard.UserDetails.UserOnlineStatus")
  const onlineStatus = getOnlineStatus(lastSeen)

  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger>
        <SectionRowWrapper
          small
          className="rounded-lg items-center justify-center bg-slate-50 dark:bg-slate-800 px-2 py-1.5 lg:px-3 lg:py-2"
        >
          <RyogoCaption color="light">{t(onlineStatus)}</RyogoCaption>
          <RyogoIcon
            icon={CircleSmall}
            thick
            size={"sm"}
            color={
              onlineStatus === "Away"
                ? "yellow"
                : onlineStatus === "Online"
                  ? "green"
                  : "light"
            }
          />
        </SectionRowWrapper>
      </TooltipTrigger>
      <TooltipContent>
        {lastSeen
          ? t("LastSeen", { time: moment(lastSeen).fromNow() })
          : t("Offline")}
      </TooltipContent>
    </Tooltip>
  )
}
