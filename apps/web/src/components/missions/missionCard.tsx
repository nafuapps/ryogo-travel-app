"use client"

import { changeIsReadMissionAction } from "@/app/actions/missions/changeIsReadMissionAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import getEntityIcon from "@/components/icons/entityIcon"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall, RyogoTiny } from "@/components/typography"
import { FindMissionsByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
import { ChevronRight, CircleCheckBig } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export default function MissionCard({
  mission,
}: {
  mission: FindMissionsByUserIdType[number]
}) {
  const t = useTranslations("Dashboard.Missions")
  const [isPending, startTransition] = useTransition()
  const [isRead, setIsRead] = useState(mission.isRead)

  const markRead = async () => {
    startTransition(async () => {
      const result = await changeIsReadMissionAction({
        missionId: mission.id,
        assignedUserId: mission.userId,
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
        assignedUserId: mission.userId,
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
      className={`transition-all delay-200 duration-300 ease-in ${isRead ? "opacity-70" : ""} ${mission.isCritical ? "border-l-4 border-red-700 dark:border-red-300" : ""}`}
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
        {mission.dueDate && (
          <RyogoCaption
            color={mission.dueDate < new Date() && !isRead ? "red" : "slate"}
          >
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
    </SectionWrapper>
  )
}
