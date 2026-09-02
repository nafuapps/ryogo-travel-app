"use client"

import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import moment from "moment"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { useTranslations } from "next-intl"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import getEntityIcon from "@/components/icons/entityIcon"
import Link from "next/link"
import { useState, useTransition } from "react"
import { markReadMissionAction } from "@/app/actions/missions/markReadMissionAction"
import { toast } from "sonner"
import { CircleCheckBig, ChevronRight } from "lucide-react"
import { markUnreadMissionAction } from "@/app/actions/missions/markUnreadMissionAction"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { Separator } from "@/components/ui/separator"
import { CarouselItem } from "@/components/ui/carousel"
import { useRouter } from "next/navigation"
import DeleteMissionAlertButton from "@/components/buttons/alert/deleteMissionAlertButton"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function MissionCard({
  mission,
  isRider,
}: {
  mission: FindMissionsByUserIdType[number]
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.Missions")
  const router = useRouter()
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
      className={`flex flex-col gap-2 lg:gap-3 p-4 lg:p-5 basis-full md:basis-1/2 xl:basis-1/3 rounded-lg transition-all delay-200 duration-300 ease-in ${isRead ? "bg-slate-50 dark:bg-slate-900 shadow-sm" : "bg-white dark:bg-slate-800 shadow"} ${!isRead ? (mission.isCritical ? "border-l-6 border-red-700 dark:border-red-300" : "border-l-6 border-sky-700 dark:border-sky-300") : ""}`}
    >
      <SectionRowWrapper center>
        <SectionRowWrapper justifyStart center>
          <RyogoEnclosedIcon
            icon={getEntityIcon(mission.entityType)}
            size="sm"
            color={isRead ? "light" : "slate"}
            bgColor={"slate"}
            circular
          />
          <div className="flex flex-col gap-0.5">
            <RyogoCaption color={isRead ? "light" : "slate"} weight="font-bold">
              {mission.entityType.toUpperCase()}
            </RyogoCaption>
            <RyogoCaption color={"light"}>
              {"(" + mission.entityId + ")"}
            </RyogoCaption>
          </div>
        </SectionRowWrapper>
        {isRead ? (
          <RyogoGhostButton
            onClick={markUnread}
            disabled={isPending}
            label={t("Card.Read")}
            labelColor="light"
          >
            <RyogoIcon icon={CircleCheckBig} size={"sm"} color="light" />
          </RyogoGhostButton>
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
      <RyogoP weight="font-bold" color={isRead ? "light" : "dark"}>
        {mission.isCustom
          ? mission.titleKey
          : t(
              mission.titleKey as Parameters<typeof t>[0],
              mission.titleObject as Record<string, string | number | Date>,
            )}
      </RyogoP>
      {mission.messageKey && (
        <RyogoCaption color={isRead ? "light" : "slate"}>
          {mission.isCustom
            ? mission.messageKey
            : t(
                mission.messageKey as Parameters<typeof t>[0],
                mission.messageObject as Record<string, string | number | Date>,
              )}
        </RyogoCaption>
      )}
      {mission.link && !isRead && (
        <Link href={mission.link as React.ComponentProps<typeof Link>["href"]}>
          <RyogoDefaultButton
            label={t("Card.CheckNow")}
            disabled={isPending}
            className="w-full"
          />
        </Link>
      )}
      {!isRead && (
        <RyogoOutlineButton
          label={t("Card.MarkRead")}
          onClick={markRead}
          disabled={isPending}
        />
      )}
      <DeleteMissionAlertButton
        isRider={isRider}
        missionId={mission.id}
        userId={mission.userId}
        agencyId={mission.agencyId}
      />
      {mission.isCustom && (
        <>
          <Separator />
          <div className="flex items-center justify-between gap-1.5 lg:gap-2">
            <RyogoPill
              label={t("Card.Custom")}
              bgColor={isRead ? "light" : "slate"}
            />
            <RyogoOutlineButton
              disabled={isPending || isRead}
              onClick={() =>
                isRider
                  ? router.push(`/rider/myMissions/${mission.id}/modify`)
                  : router.push(`/dashboard/missions/${mission.id}/modify`)
              }
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
              label={t("Card.EditMission")}
            >
              <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
            </RyogoOutlineButton>
          </div>
        </>
      )}
    </CarouselItem>
  )
}
