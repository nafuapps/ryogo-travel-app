import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { getVehicleIcon } from "@/components/icons/vehicleIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import {
  LeaveStatusPill,
  RepairStatusPill,
} from "@/components/pills/ryogoPills"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import { RyogoCaption, RyogoH4 } from "@/components/typography"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import { ChevronRight, IdCard } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function RepairPopoverCard(
  repair: FindVehiclesScheduleNextDaysType[number]["vehicleRepairs"][number],
) {
  const t = useTranslations("Components.RepairCard")
  const isDelayed = repair.endDate < new Date()
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoImageIconTag
          label={repair.vehicle.vehicleNumber}
          url={repair.vehicle.vehiclePhotoUrl}
          icon={getVehicleIcon(repair.vehicle.type)}
        />
        <RyogoH4 color={isDelayed ? "red" : "slate"}>
          {moment(repair.startDate).format("DD MMM") +
            " - " +
            moment(repair.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      {repair.remarks && (
        <RyogoCaption color="light">{repair.remarks}</RyogoCaption>
      )}
      <RepairStatusPill status={repair.status} />
      <Link href={`/dashboard/vehicles/${repair.vehicleId}/repairs`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full">
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
        </RyogoOutlineButton>
      </Link>
    </SectionColWrapper>
  )
}

export function LeavePopoverCard(
  leave: FindDriversScheduleNextDaysType[number]["driverLeaves"][number],
) {
  const t = useTranslations("Components.LeaveCard")
  const isDelayed = leave.endDate < new Date()
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoImageIconTag
          label={leave.driver.name}
          url={leave.driver.user.photoUrl}
          icon={IdCard}
        />
        <RyogoH4 color={isDelayed ? "red" : "slate"}>
          {moment(leave.startDate).format("DD MMM") +
            " - " +
            moment(leave.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      {leave.remarks && (
        <RyogoCaption color="light">{leave.remarks}</RyogoCaption>
      )}
      <LeaveStatusPill status={leave.status} />
      <Link href={`/dashboard/drivers/${leave.driverId}/leaves`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full">
          <RyogoIcon icon={ChevronRight} size="xs" color="light" thick />
        </RyogoOutlineButton>
      </Link>
    </SectionColWrapper>
  )
}
