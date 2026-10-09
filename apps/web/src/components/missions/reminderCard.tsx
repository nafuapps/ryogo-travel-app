"use client"

import { FindRemindersByUserIdType } from "@ryogo-travel-app/api/services/mission.services"
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
import { useState, useTransition } from "react"
import { changeIsReadMissionAction } from "@/app/actions/missions/changeIsReadMissionAction"
import { toast } from "sonner"
import { CircleCheckBig, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function ReminderCard({
  reminder,
  isRider,
}: {
  reminder: FindRemindersByUserIdType[number]
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.Reminders")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRead, setIsRead] = useState(reminder.isRead)

  const markRead = async () => {
    startTransition(async () => {
      const result = await changeIsReadMissionAction({
        missionId: reminder.id,
        userId: reminder.userId,
        agencyId: reminder.agencyId,
        isRead: true,
      })
      if (result) {
        setIsRead(result.isRead)
      } else {
        toast.error(t("Card.ErrorMarkingDone"))
      }
    })
  }

  const markUnread = async () => {
    startTransition(async () => {
      const result = await changeIsReadMissionAction({
        missionId: reminder.id,
        userId: reminder.userId,
        agencyId: reminder.agencyId,
        isRead: false,
      })
      if (result) {
        setIsRead(result.isRead)
      } else {
        toast.error(t("Card.ErrorMarkingUndone"))
      }
    })
  }

  return (
    <SectionWrapper
      id={reminder.id}
      className={`transition-all delay-200 duration-300 ease-in ${isRead ? "opacity-70" : ""} ${reminder.isCritical ? "border-l-4 border-red-700 dark:border-red-300" : ""}`}
    >
      <SectionRowWrapper className="items-center justify-between">
        <SectionRowWrapper className="items-center justify-start">
          <RyogoEnclosedIcon
            icon={getEntityIcon(reminder.entityType)}
            size="sm"
            color={isRead ? "light" : "slate"}
          />
          <div className="flex flex-col gap-0.5">
            <RyogoCaption color={isRead ? "light" : "slate"} weight="font-bold">
              {reminder.entityType}
            </RyogoCaption>
            <RyogoTiny color={"light"}>{reminder.entityId}</RyogoTiny>
          </div>
        </SectionRowWrapper>
        {reminder.dueDate && (
          <RyogoCaption
            color={reminder.dueDate < new Date() && !isRead ? "red" : "slate"}
          >
            {t("Card.Due") + moment(reminder.dueDate).fromNow()}
          </RyogoCaption>
        )}
      </SectionRowWrapper>
      <SectionColWrapper small>
        <RyogoSmall weight="font-bold" color="slate">
          {reminder.titleKey}
        </RyogoSmall>
        {reminder.messageKey && (
          <RyogoCaption color="light">{reminder.messageKey}</RyogoCaption>
        )}
      </SectionColWrapper>
      <SectionRowWrapper>
        {isRead ? (
          <RyogoOutlineButton
            onClick={markUnread}
            disabled={isPending}
            label={t("Card.Done")}
            labelColor="light"
            className="grow"
          >
            <RyogoIcon icon={CircleCheckBig} size="xs" color="light" />
          </RyogoOutlineButton>
        ) : (
          <RyogoOutlineButton
            label={t("Card.MarkDone")}
            onClick={markRead}
            className="grow"
            disabled={isPending}
          />
        )}
        {!isRead && (
          <RyogoOutlineButton
            disabled={isPending || isRead}
            onClick={() =>
              isRider
                ? router.push(
                    `/rider/myMissions/myReminders/${reminder.id}/modify`,
                  )
                : router.push(
                    `/dashboard/missions/reminders/${reminder.id}/modify`,
                  )
            }
            className="grow"
            label={t("Card.EditReminder")}
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
          </RyogoOutlineButton>
        )}
      </SectionRowWrapper>
    </SectionWrapper>
  )
}
