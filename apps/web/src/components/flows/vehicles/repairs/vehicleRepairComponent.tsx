"use client"

import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
} from "@/components/page/pageWrappers"
import { RepairStatusPill } from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"
import RyogoTag from "@/components/tags/ryogoTag"
import { RyogoSmall } from "@/components/typography"
import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
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
}: {
  repair: FindAllVehicleRepairsByVehicleIdType[number]
  canModify: boolean
}) {
  const t = useTranslations("Dashboard.VehicleRepairs")
  const [open, setOpen] = useState(canModify)

  return (
    <SectionColWrapper className="w-full p-4 lg:p-5 border rounded-md">
      <SectionRowWrapper className="items-center justify-between">
        <DateWrapper date={repair.startDate} hideYear />
        <SectionColWrapper small className="w-full items-center">
          {repair.cost !== null && repair.cost > 0 && (
            <RyogoSmall color="slate">
              {t("Cost", { cost: repair.cost })}
            </RyogoSmall>
          )}
          <RyogoRoundedDashedTag
            label={t("Days", {
              days: differenceInDays(repair.endDate, repair.startDate) + 1,
            })}
          />
        </SectionColWrapper>
        <DateWrapper date={repair.endDate} hideYear />
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <RepairStatusPill
          status={repair.isCompleted ? t("Completed") : t("Pending")}
          completed={repair.isCompleted}
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
          {repair.remarks && (
            <RyogoTag label={repair.remarks} icon={MessageSquareQuote} />
          )}
          <SectionRowWrapper className="items-center justify-between">
            <RyogoImageIconTag
              url={repair.addedByUser.photoUrl}
              label={repair.addedByUser.name}
              subtitle={repair.addedByUser.userRole}
            />
            {canModify && (
              <Link
                href={`/dashboard/vehicles/${repair.vehicleId}/repairs/modify/${repair.id}`}
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
