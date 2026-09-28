"use client"

import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"
import RyogoTag from "@/components/tags/ryogoTag"
import { FindAllDriverLeavesByDriverIdType } from "@ryogo-travel-app/api/services/driver.services"
import { differenceInDays } from "date-fns"
import {
  MessageSquareQuote,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useState } from "react"

export default function DriverLeaveComponent({
  leave,
  canModify,
}: {
  leave: FindAllDriverLeavesByDriverIdType[number]
  canModify?: boolean
}) {
  const t = useTranslations("Dashboard.DriverLeaves")
  const [open, setOpen] = useState(canModify)

  return (
    <SectionColWrapper className="w-full p-4 lg:p-5 border rounded-md">
      <SectionRowWrapper className="items-center justify-between">
        <DateWrapper date={leave.startDate} hideYear />
        <SectionColWrapper small className="w-full items-center">
          <RyogoRoundedDashedTag
            label={t("Days", {
              days: differenceInDays(leave.endDate, leave.startDate) + 1,
            })}
          />
        </SectionColWrapper>
        <DateWrapper date={leave.endDate} hideYear />
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <LeaveStatusPill
          status={leave.isCompleted ? t("Completed") : t("Pending")}
          completed={leave.isCompleted}
          className="w-full"
        />
        <RyogoIcon
          onClick={() => setOpen(!open)}
          size="sm"
          icon={open ? ChevronUp : ChevronDown}
          color="light"
          thick
        />
      </SectionRowWrapper>
      {open && (
        <>
          {leave.remarks && (
            <RyogoTag label={leave.remarks} icon={MessageSquareQuote} />
          )}
          <SectionRowWrapper className="items-center justify-between">
            <RyogoImageIconTag
              url={leave.addedByUser.photoUrl}
              label={leave.addedByUser.name}
              subtitle={leave.addedByUser.userRole}
            />
            {canModify && (
              <Link
                href={`/dashboard/drivers/${leave.driverId}/leaves/modify/${leave.id}`}
              >
                <RyogoOutlineButton label={t("Edit")}>
                  <RyogoIcon icon={ChevronRight} size="sm" />
                </RyogoOutlineButton>
              </Link>
            )}
          </SectionRowWrapper>
        </>
      )}
    </SectionColWrapper>
  )
}
