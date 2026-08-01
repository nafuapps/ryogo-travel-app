"use client"

import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import moment from "moment"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { useTranslations } from "next-intl"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import getEntityIcon from "@/components/icons/entityIcon"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UrlObject } from "url"
import { useState, useTransition } from "react"
import { markReadMissionAction } from "@/app/actions/missions/markReadMissionAction"
import { toast } from "sonner"
import { CircleCheckBig, ChevronRight } from "lucide-react"
import { markUnreadMissionAction } from "@/app/actions/missions/markUnreadMissionAction"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { Separator } from "@/components/ui/separator"
import { CarouselItem } from "@/components/ui/carousel"

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
      const result = await markReadMissionAction(
        mission.id,
        mission.userId,
        mission.agencyId,
      )
      if (result) {
        setIsRead(true)
      } else {
        toast.error(t("Card.ErrorMarkingRead"))
      }
    })
  }

  const markUnread = async () => {
    startTransition(async () => {
      const result = await markUnreadMissionAction(
        mission.id,
        mission.userId,
        mission.agencyId,
      )
      if (result) {
        setIsRead(false)
      } else {
        toast.error(t("Card.ErrorMarkingUnread"))
      }
    })
  }

  return (
    <CarouselItem
      className={`flex flex-col gap-2 lg:gap-3 p-4 lg:p-5 basis-full md:basis-1/2 xl:basis-1/3 rounded-lg transition-all delay-200 duration-300 ease-in ${isRead ? "bg-slate-200 dark:bg-slate-700 shadow-sm" : "bg-white dark:bg-slate-900 shadow"} ${!isRead ? (mission.isCritical ? "border-l-6 border-red-700 dark:border-red-300" : "border-l-6 border-sky-700 dark:border-sky-300") : ""}`}
    >
      <SectionRowWrapper center>
        <SectionRowWrapper justifyStart center>
          <RyogoEnclosedIcon
            icon={getEntityIcon(mission.entityType)}
            size="sm"
            color={mission.isRead ? "light" : "brand"}
            bgColor={mission.isRead ? "slate" : "brand"}
            circular
          />
          <div className="flex flex-col gap-0.5">
            <RyogoCaption
              color={mission.isRead ? "light" : "brand"}
              weight="font-bold"
            >
              {mission.entityType.toUpperCase()}
            </RyogoCaption>
            <RyogoCaption color={mission.isRead ? "light" : "brand"}>
              {"(" + mission.entityId + ")"}
            </RyogoCaption>
          </div>
        </SectionRowWrapper>
        {mission.isRead ? (
          <Button
            variant={"secondary"}
            onClick={markUnread}
            disabled={isPending}
          >
            <RyogoIcon icon={CircleCheckBig} size={"sm"} />
            <RyogoCaption color="slate">{t("Card.Read")}</RyogoCaption>
          </Button>
        ) : (
          mission.dueDate && (
            <RyogoCaption
              color={mission.dueDate < new Date() ? "red" : "slate"}
            >
              {t("Card.Due") + moment(mission.dueDate).fromNow()}
            </RyogoCaption>
          )
        )}
      </SectionRowWrapper>
      <RyogoP weight="font-bold" color={mission.isRead ? "light" : "dark"}>
        {mission.isCustom
          ? mission.titleKey
          : t(
              mission.titleKey as Parameters<typeof t>[0],
              mission.titleObject as Record<string, string | number | Date>,
            )}
      </RyogoP>
      {mission.messageKey && (
        <RyogoCaption color={mission.isRead ? "light" : "slate"}>
          {mission.isCustom
            ? mission.messageKey
            : t(
                mission.messageKey as Parameters<typeof t>[0],
                mission.messageObject as Record<string, string | number | Date>,
              )}
        </RyogoCaption>
      )}
      <div></div>
      {mission.link && (
        <Link href={mission.link as any as UrlObject}>
          <Button
            variant={mission.isRead ? "secondary" : "default"}
            disabled={isPending}
            className="w-full"
          >
            <RyogoCaption
              color={mission.isRead ? "light" : "white"}
              weight="font-bold"
            >
              {t("Card.CheckNow")}
            </RyogoCaption>
          </Button>
        </Link>
      )}
      {!mission.isRead && (
        <Button variant={"outline"} onClick={markRead} disabled={isPending}>
          <RyogoCaption color={mission.isRead ? "light" : "slate"}>
            {t("Card.MarkRead")}
          </RyogoCaption>
        </Button>
      )}
      {mission.isCustom && (
        <>
          <Separator />
          <div className="flex items-center justify-between gap-1.5 lg:gap-2">
            <RyogoPill label={t("Card.Custom")} bgColor={"slate"} />
            <Button
              variant={"link"}
              size="sm"
              disabled={isPending || isRead}
              className="hover:bg-slate-50 dark:hover:bg-slate-900 hover:no-underline"
            >
              <Link
                href={`/dashboard/mission-control/${mission.id}/modify`}
                className="flex items-center gap-0.5"
              >
                <RyogoCaption color="slate">
                  {t("Card.EditMission")}
                </RyogoCaption>
                <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </CarouselItem>
  )
}
