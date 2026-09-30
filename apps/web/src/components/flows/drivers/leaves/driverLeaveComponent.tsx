"use client"

import FinishDriverLeaveAlertButton from "@/components/buttons/alert/finishDriverLeaveAlertButton"
import StartDriverLeaveAlertButton from "@/components/buttons/alert/startDriverLeaveAlertButton"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"
import RyogoTag from "@/components/tags/ryogoTag"
import { getDisplayEndDate } from "@/lib/utils"
import {
  FindAllDriverLeavesByDriverIdType,
  FindDriverByUserIdType,
  FindDriverDetailsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import {
  DriverStatusEnum,
  DriverLeaveStatusEnum,
} from "@ryogo-travel-app/db/schema"
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
  driver,
  canModify,
  isRider,
}: {
  leave: FindAllDriverLeavesByDriverIdType[number]
  driver:
    | NonNullable<FindDriverByUserIdType>
    | NonNullable<FindDriverDetailsByIdType>
  canModify?: boolean
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.DriverLeaves")
  const [open, setOpen] = useState(false)

  const today = new Date()

  const mayStart =
    (canModify || isRider) &&
    leave.status === DriverLeaveStatusEnum.PENDING &&
    differenceInDays(today, leave.startDate) >= 0

  const canStart = mayStart && driver.status === DriverStatusEnum.AVAILABLE
  const onTrip = mayStart && driver.status === DriverStatusEnum.ON_TRIP
  const alreadyOnLeave = mayStart && driver.status === DriverStatusEnum.LEAVE

  const canEnd =
    (canModify || isRider) &&
    leave.status === DriverLeaveStatusEnum.ONGOING &&
    driver.status === DriverStatusEnum.LEAVE

  const displayStartDate = leave.actualStartDate ?? leave.startDate
  const displayEndDate = getDisplayEndDate(
    leave.startDate,
    leave.endDate,
    leave.actualStartDate,
    leave.actualEndDate,
  )

  return (
    <SectionWrapper id={leave.id}>
      <SectionRowWrapper className="items-center justify-between">
        <DateWrapper date={displayStartDate} hideYear />
        <SectionColWrapper small className="w-full items-center">
          <RyogoRoundedDashedTag
            label={t("Days", {
              days: differenceInDays(displayEndDate, displayStartDate) + 1,
            })}
          />
        </SectionColWrapper>
        <DateWrapper date={displayEndDate} hideYear />
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <LeaveStatusPill status={leave.status} />
        <RyogoIcon
          onClick={() => setOpen(!open)}
          size="sm"
          icon={open ? ChevronUp : ChevronDown}
          color="light"
          thick
        />
      </SectionRowWrapper>
      {canStart && (
        <StartDriverLeaveAlertButton
          userId={isRider ? driver.userId : leave.addedByUserId}
          driverId={driver.id}
          leaveId={leave.id}
          agencyId={driver.agencyId}
        />
      )}
      {onTrip && (
        <RyogoOutlineButton
          label={t("OnTrip")}
          labelColor="light"
          className="w-full cursor-not-allowed"
          disabled
        />
      )}
      {alreadyOnLeave && (
        <RyogoOutlineButton
          label={t("AlreadyOnLeave")}
          labelColor="yellow"
          className="w-full cursor-not-allowed"
          disabled
        />
      )}
      {canEnd && (
        <FinishDriverLeaveAlertButton
          userId={isRider ? driver.userId : leave.addedByUserId}
          driverId={driver.id}
          leaveId={leave.id}
          agencyId={driver.agencyId}
        />
      )}
      <SectionColWrapper className={`${open ? "" : "hidden"}`}>
        {leave.remarks && (
          <RyogoTag label={leave.remarks} icon={MessageSquareQuote} />
        )}
        <SectionRowWrapper className="items-center justify-between">
          <RyogoImageIconTag
            url={leave.addedByUser.photoUrl}
            label={leave.addedByUser.name}
            subtitle={leave.addedByUser.userRole}
          />
          {canModify && leave.status !== DriverLeaveStatusEnum.ONGOING && (
            <Link
              href={`/dashboard/drivers/${leave.driverId}/leaves/modify/${leave.id}`}
            >
              <RyogoOutlineButton label={t("Edit")}>
                <RyogoIcon icon={ChevronRight} size="sm" />
              </RyogoOutlineButton>
            </Link>
          )}
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionWrapper>
  )
}
