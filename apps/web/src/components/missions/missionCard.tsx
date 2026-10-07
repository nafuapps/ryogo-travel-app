"use client"

import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import moment from "moment"
import { RyogoCaption, RyogoSmall, RyogoTiny } from "@/components/typography"
import { useTranslations } from "next-intl"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import getEntityIcon from "@/components/icons/entityIcon"
import Link from "next/link"
import { useState, useTransition } from "react"
import { changeIsReadMissionAction } from "@/app/actions/missions/changeIsReadMissionAction"
import { toast } from "sonner"
import { CircleCheckBig, ChevronRight } from "lucide-react"
import { RyogoPill } from "@/components/pills/ryogoPills"
import { useRouter } from "next/navigation"
import {
  RyogoDefaultButton,
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
      const result = await changeIsReadMissionAction({
        missionId: mission.id,
        userId: mission.userId,
        agencyId: mission.agencyId,
        isRead: true,
      })
      if (result) {
        setIsRead(result.isRead)
      } else {
        toast.error(t("Card.ErrorMarkingRead"))
      }
    })
  }

  const markUnread = async () => {
    startTransition(async () => {
      const result = await changeIsReadMissionAction({
        missionId: mission.id,
        userId: mission.userId,
        agencyId: mission.agencyId,
        isRead: false,
      })
      if (result) {
        setIsRead(result.isRead)
      } else {
        toast.error(t("Card.ErrorMarkingUnread"))
      }
    })
  }

  return (
    <SectionWrapper
      id={mission.id}
      className={`transition-all delay-200 duration-300 ease-in ${isRead ? "opacity-70" : ""}`}
    >
      <SectionRowWrapper className="items-center justify-between">
        <SectionRowWrapper className="items-center justify-start">
          <RyogoEnclosedIcon
            icon={getEntityIcon(mission.entityType)}
            size="sm"
            color={isRead ? "light" : "slate"}
          />
          <div className="flex flex-col gap-0.5">
            <RyogoCaption color={isRead ? "light" : "slate"} weight="font-bold">
              {mission.entityType}
            </RyogoCaption>
            <RyogoTiny color={"light"}>{mission.entityId}</RyogoTiny>
          </div>
        </SectionRowWrapper>
        {mission.dueDate && !isRead && (
          <RyogoCaption color={mission.dueDate < new Date() ? "red" : "slate"}>
            {t("Card.Due") + moment(mission.dueDate).fromNow()}
          </RyogoCaption>
        )}
      </SectionRowWrapper>
      <SectionColWrapper small>
        <RyogoSmall weight="font-bold" color="slate">
          {mission.isCustom
            ? mission.titleKey
            : t(
                mission.titleKey as Parameters<typeof t>[0],
                mission.titleObject as Record<string, string | number | Date>,
              )}
        </RyogoSmall>
        {mission.messageKey && (
          <RyogoCaption color="light">
            {mission.isCustom
              ? mission.messageKey
              : t(
                  mission.messageKey as Parameters<typeof t>[0],
                  mission.messageObject as Record<
                    string,
                    string | number | Date
                  >,
                )}
          </RyogoCaption>
        )}
      </SectionColWrapper>
      <SectionRowWrapper>
        {isRead ? (
          <RyogoOutlineButton
            onClick={markUnread}
            disabled={isPending}
            label={t("Card.Read")}
            labelColor="light"
            className="grow"
          >
            <RyogoIcon icon={CircleCheckBig} size="xs" color="light" />
          </RyogoOutlineButton>
        ) : (
          <RyogoOutlineButton
            label={t("Card.MarkRead")}
            onClick={markRead}
            className="grow"
            disabled={isPending}
          />
        )}
        {mission.link && !isRead && (
          <Link
            href={mission.link as React.ComponentProps<typeof Link>["href"]}
            className="grow"
          >
            <RyogoDefaultButton
              label={t("Card.CheckNow")}
              className="w-full"
              disabled={isPending}
            >
              <RyogoIcon icon={ChevronRight} size="xs" color="white" thick />
            </RyogoDefaultButton>
          </Link>
        )}
      </SectionRowWrapper>
      {mission.isCustom && (
        <SectionRowWrapper
          small
          className="items-center justify-between border p-2 lg:p-3 rounded-md"
        >
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
            className="hover:bg-slate-100 dark:hover:bg-slate-700"
            label={t("Card.EditMission")}
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
          </RyogoOutlineButton>
        </SectionRowWrapper>
      )}
    </SectionWrapper>
  )
}
