"use client"

import FinishVehicleRepairAlertButton from "@/components/buttons/alert/finishVehicleRepairAlertButton"
import StartVehicleRepairAlertButton from "@/components/buttons/alert/startVehicleRepairAlertButton"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RepairStatusPill } from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"
import RyogoTag from "@/components/tags/ryogoTag"
import { RyogoSmall } from "@/components/typography"
import { getDisplayEndDate } from "@/lib/utils"
import {
  FindAllVehicleRepairsByVehicleIdType,
  FindVehicleDetailsByIdType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import {
  VehicleRepairStatusEnum,
  VehicleStatusEnum,
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

export default function VehicleRepairComponent({
  repair,
  canModify,
  vehicle,
}: {
  repair: FindAllVehicleRepairsByVehicleIdType[number]
  canModify: boolean
  vehicle: NonNullable<FindVehicleDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.VehicleRepairs")
  const [open, setOpen] = useState(false)
  const today = new Date()

  const mayStart =
    canModify &&
    repair.status === VehicleRepairStatusEnum.PENDING &&
    differenceInDays(today, repair.startDate) >= 0

  const canStart = mayStart && vehicle.status === VehicleStatusEnum.AVAILABLE
  const onTrip = mayStart && vehicle.status === VehicleStatusEnum.ON_TRIP
  const alreadyInRepair =
    mayStart && vehicle.status === VehicleStatusEnum.REPAIR

  const canEnd =
    canModify &&
    repair.status === VehicleRepairStatusEnum.ONGOING &&
    vehicle.status === VehicleStatusEnum.REPAIR

  const displayStartDate = repair.actualStartDate ?? repair.startDate
  const displayEndDate = getDisplayEndDate(
    repair.startDate,
    repair.endDate,
    repair.actualStartDate,
    repair.actualEndDate,
  )

  return (
    <SectionWrapper id={repair.id}>
      <SectionRowWrapper className="items-center justify-between">
        <DateWrapper date={displayStartDate} hideYear />
        <SectionColWrapper small className="w-full items-center">
          {repair.cost !== null && repair.cost > 0 && (
            <RyogoSmall color="slate">
              {t("Cost", { cost: repair.cost })}
            </RyogoSmall>
          )}
          <RyogoRoundedDashedTag
            label={t("Days", {
              days: differenceInDays(displayEndDate, displayStartDate) + 1,
            })}
          />
        </SectionColWrapper>
        <DateWrapper date={displayEndDate} hideYear />
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <RepairStatusPill status={repair.status} />
        <RyogoIcon
          onClick={() => setOpen(!open)}
          size="sm"
          icon={open ? ChevronUp : ChevronDown}
          color="light"
          thick
        />
      </SectionRowWrapper>
      {canStart && (
        <StartVehicleRepairAlertButton
          userId={repair.addedByUserId}
          vehicleId={vehicle.id}
          repairId={repair.id}
          agencyId={vehicle.agencyId}
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
      {alreadyInRepair && (
        <RyogoOutlineButton
          label={t("AlreadyInRepair")}
          labelColor="yellow"
          className="w-full cursor-not-allowed"
          disabled
        />
      )}
      {canEnd && (
        <FinishVehicleRepairAlertButton
          userId={repair.addedByUserId}
          vehicleId={vehicle.id}
          repairId={repair.id}
          agencyId={vehicle.agencyId}
        />
      )}
      <SectionColWrapper className={`${open ? "" : "hidden"}`}>
        {repair.remarks && (
          <RyogoTag label={repair.remarks} icon={MessageSquareQuote} />
        )}
        <SectionRowWrapper className="items-center justify-between">
          <RyogoImageIconTag
            url={repair.addedByUser.photoUrl}
            label={repair.addedByUser.name}
            subtitle={repair.addedByUser.userRole}
          />
          {canModify && repair.status !== VehicleRepairStatusEnum.ONGOING && (
            <Link
              href={`/dashboard/vehicles/${repair.vehicleId}/repairs/modify/${repair.id}`}
            >
              <RyogoOutlineButton label={t("Edit")} className="w-full">
                <RyogoIcon icon={ChevronRight} size="sm" />
              </RyogoOutlineButton>
            </Link>
          )}
        </SectionRowWrapper>
      </SectionColWrapper>
    </SectionWrapper>
  )
}
