"use client"

import FinishDriverLeaveAlertButton from "@/components/buttons/alert/finishDriverLeaveAlertButton"
import StartDriverLeaveAlertButton from "@/components/buttons/alert/startDriverLeaveAlertButton"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
} from "@/components/page/pageWrappers"
import { LeaveStatusPill } from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"
import RyogoTag from "@/components/tags/ryogoTag"
import {
  FindAllDriverLeavesByDriverIdType,
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
  driver: NonNullable<FindDriverDetailsByIdType>

  canModify?: boolean
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.DriverLeaves")
  const [open, setOpen] = useState(canModify)

  const today = new Date()

  const canStart =
    (canModify || isRider) &&
    leave.status === DriverLeaveStatusEnum.PENDING &&
    differenceInDays(today, leave.startDate) >= 0

  const canEnd =
    (canModify || isRider) &&
    leave.status === DriverLeaveStatusEnum.ONGOING &&
    driver.status === DriverStatusEnum.LEAVE

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
        <LeaveStatusPill status={leave.status} />
        <RyogoEnclosedIcon
          onClick={() => setOpen(!open)}
          size="sm"
          icon={open ? ChevronUp : ChevronDown}
          color="light"
          thick
        />
      </SectionRowWrapper>
      {canStart &&
        (driver.status !== DriverStatusEnum.ON_TRIP ? (
          <StartDriverLeaveAlertButton
            userId={isRider ? driver.userId : leave.addedByUserId}
            driverId={driver.id}
            leaveId={leave.id}
            agencyId={driver.agencyId}
          />
        ) : (
          <RyogoOutlineButton
            label={t("OnTrip")}
            labelColor="light"
            className="grow"
            disabled
          />
        ))}
      {canEnd && (
        <FinishDriverLeaveAlertButton
          userId={isRider ? driver.userId : leave.addedByUserId}
          driverId={driver.id}
          leaveId={leave.id}
          agencyId={driver.agencyId}
        />
      )}
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
