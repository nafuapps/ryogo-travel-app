"use client"

import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import moment from "moment"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import getEntityIcon from "@/components/icons/entityIcon"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UrlObject } from "url"
import { useState, useTransition } from "react"
import { markReadMissionAction } from "@/app/actions/missions/markReadMissionAction"
import { toast } from "sonner"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { CircleCheckBig } from "lucide-react"

export default function MissionCard({
  mission,
}: {
  mission: FindMissionsByUserIdType[number]
}) {
  const t = useTranslations("Dashboard.MissionControl")
  const [isPending, startTransition] = useTransition()
  const [isRead, setIsRead] = useState(mission.isRead)

  const markRead = async () => {
    startTransition(async () => {
      const result = await markReadMissionAction(mission.id)
      if (result) {
        setIsRead(true)
      } else {
        toast.error(t("ErrorMarkingRead"))
      }
    })
  }

  return (
    <div
      className={`flex flex-col gap-3 lg:gap-4 p-4 lg:p-5 rounded-lg transition-all delay-200 duration-300 ease-in ${isRead ? "bg-slate-200 shadow-sm" : "bg-white shadow-lg"} ${!isRead ? (mission.isCritical ? "border-l-6 border-red-600" : "border-l-6 border-sky-700") : ""}`}
    >
      <SectionRowWrapper center>
        <SectionRowWrapper justifyStart center>
          <RyogoEnclosedIcon
            icon={getEntityIcon(mission.entityType)}
            size="sm"
            color={isRead ? "light" : "brand"}
            bgColor={isRead ? "slate" : "brand"}
            circular
          />
          <RyogoCaption color={isRead ? "light" : "brand"} weight="font-bold">
            {mission.entityType.toUpperCase()}
          </RyogoCaption>
        </SectionRowWrapper>
        {mission.isRead ? (
          <IconTextTag text={t("Read")} icon={CircleCheckBig} />
        ) : (
          mission.dueDate && (
            <RyogoCaption
              color={mission.dueDate < new Date() ? "red" : "slate"}
            >
              {t("Due") + moment(mission.dueDate).fromNow()}
            </RyogoCaption>
          )
        )}
      </SectionRowWrapper>
      <RyogoP weight="font-bold" color={mission.isRead ? "light" : "dark"}>
        {t(
          mission.titleKey as Parameters<typeof t>[0],
          mission.titleObject as Record<string, string | number | Date>,
        )}
      </RyogoP>
      <RyogoSmall color="light">
        {t(
          mission.messageKey as Parameters<typeof t>[0],
          mission.messageObject as Record<string, string | number | Date>,
        )}
      </RyogoSmall>
      {mission.link && (
        <Button
          variant={mission.isRead ? "secondary" : "default"}
          disabled={isPending}
        >
          <Link href={mission.link as any as UrlObject} className="w-full">
            <RyogoCaption
              color={mission.isRead ? "light" : "white"}
              weight="font-bold"
            >
              {t("CheckNow")}
            </RyogoCaption>
          </Link>
        </Button>
      )}
      {!mission.isRead && (
        <Button variant={"secondary"} onClick={markRead} disabled={isPending}>
          {t("MarkRead")}
        </Button>
      )}
    </div>
  )
}
