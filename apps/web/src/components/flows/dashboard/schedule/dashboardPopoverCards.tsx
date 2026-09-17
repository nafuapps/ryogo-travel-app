import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoH4, RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindDriversScheduleNextDaysType } from "@ryogo-travel-app/api/services/driver.services"
import { FindVehiclesScheduleNextDaysType } from "@ryogo-travel-app/api/services/vehicle.services"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function RepairPopoverCard(
  repair: FindVehiclesScheduleNextDaysType[number]["vehicleRepairs"][number],
) {
  const t = useTranslations("BookingCards")
  const isDelayed = repair.endDate < new Date()
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoCaption color="slate">
          {repair.vehicle.vehicleNumber}
        </RyogoCaption>
        <RyogoH4 color={isDelayed ? "red" : "slate"}>
          {moment(repair.startDate).format("DD MMM") +
            " - " +
            moment(repair.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      <SectionColWrapper small>
        <RyogoSmall>{repair.addedByUser.name}</RyogoSmall>
        <RyogoCaption weight="font-bold">{repair.id}</RyogoCaption>
      </SectionColWrapper>
      <Link href={`/dashboard/vehicles/${repair.vehicleId}/repairs`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full" />
      </Link>
    </SectionColWrapper>
  )
}

export function LeavePopoverCard(
  leave: FindDriversScheduleNextDaysType[number]["driverLeaves"][number],
) {
  const t = useTranslations("BookingCards")
  const isDelayed = leave.endDate < new Date()
  return (
    <SectionColWrapper>
      <SectionColWrapper small>
        <RyogoCaption color="slate">{leave.driver.name}</RyogoCaption>
        <RyogoH4 color={isDelayed ? "red" : "slate"}>
          {moment(leave.startDate).format("DD MMM") +
            " - " +
            moment(leave.endDate).format("DD MMM")}
        </RyogoH4>
      </SectionColWrapper>
      <SectionColWrapper small>
        <RyogoSmall>{leave.addedByUser.name}</RyogoSmall>
        <RyogoCaption weight="font-bold">{leave.id}</RyogoCaption>
      </SectionColWrapper>
      <Link href={`/dashboard/drivers/${leave.driverId}/leaves`}>
        <RyogoOutlineButton label={t("ViewDetails")} className="w-full" />
      </Link>
    </SectionColWrapper>
  )
}
