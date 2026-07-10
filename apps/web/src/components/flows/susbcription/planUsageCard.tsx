import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import {
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT,
  BASIC_PLAN_DRIVER_LIMIT,
  BASIC_PLAN_VEHICLE_LIMIT,
  BASIC_PLAN_AGENT_LIMIT,
} from "@/lib/uiConfig"
import { FindAgencyDataType } from "@ryogo-travel-app/api/services/agency.services"
import { Info } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function PlanUsageCard({
  agencyData,
  confirmedBookingsLength,
  isBasic,
  daysToExpiry,
}: {
  agencyData: FindAgencyDataType
  confirmedBookingsLength: number
  isBasic: boolean
  daysToExpiry: number
}) {
  const t = await getTranslations("Dashboard.AccountSubscription.PlanUsage")

  const vehicleLength = agencyData.vehicles.length
  const driverLength = agencyData.drivers.length
  const agentLength = agencyData.agents.length

  const bookingsRatio =
    (confirmedBookingsLength * 100) / BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT

  const vehiclesRatio = (vehicleLength * 100) / BASIC_PLAN_VEHICLE_LIMIT
  const driversRatio = (driverLength * 100) / BASIC_PLAN_DRIVER_LIMIT
  const agentsRatio = (agentLength * 100) / BASIC_PLAN_AGENT_LIMIT

  const needsWarning =
    bookingsRatio >= 1 ||
    vehiclesRatio >= 1 ||
    driversRatio >= 1 ||
    agentsRatio >= 1

  return (
    <SectionWrapper id="UsageSection">
      <RyogoCaption color={"light"}>{t("Header")}</RyogoCaption>
      {(isBasic ||
        daysToExpiry +
          BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS <
          0) && (
        <UsageElement
          label={t("BookingsUsage", {
            days: BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
          })}
          usageNumber={
            confirmedBookingsLength.toString() +
            " / " +
            BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT
          }
          ratio={bookingsRatio}
        />
      )}
      <UsageElement
        label={t("DriversUsage")}
        usageNumber={driverLength.toString() + " / " + BASIC_PLAN_DRIVER_LIMIT}
        ratio={driversRatio}
      />
      <UsageElement
        label={t("VehiclesUsage")}
        usageNumber={
          vehicleLength.toString() + " / " + BASIC_PLAN_VEHICLE_LIMIT
        }
        ratio={vehiclesRatio}
      />
      <UsageElement
        label={t("AgentsUsage")}
        usageNumber={agentLength.toString() + " / " + BASIC_PLAN_AGENT_LIMIT}
        ratio={agentsRatio}
      />
      {needsWarning && (
        <div className="flex items-center gap-1.5 md:gap-2 p-2 md:p-3 bg-yellow-50 rounded-lg">
          <RyogoIcon icon={Info} size="sm" color="yellow" />
          <RyogoCaption color="yellow">{t("Warning")}</RyogoCaption>
        </div>
      )}
    </SectionWrapper>
  )
}

function UsageElement({
  label,
  usageNumber,
  ratio,
}: {
  label: string
  usageNumber: string
  ratio: number
}) {
  let bgColor = `bg-gradient-to-r`
  if (ratio >= 100) {
    bgColor += " from-red-800 to-red-500"
  } else if (ratio >= 80) {
    bgColor += " from-yellow-800 to-yellow-500"
  } else {
    bgColor += " from-sky-800 to-sky-500"
  }
  return (
    <div className="flex flex-col gap-1 lg:gap-1.5">
      <SectionRowWrapper small>
        <RyogoSmall weight="font-bold">{label}</RyogoSmall>
        <RyogoSmall weight="font-bold">{usageNumber}</RyogoSmall>
      </SectionRowWrapper>
      <div className="rounded-full overflow-hidden h-2 lg:h-2.5 bg-slate-200">
        <div
          className={`h-full rounded-full ${bgColor}`}
          style={{ width: (ratio > 100 ? 100 : ratio) + "%" }}
        />
      </div>
    </div>
  )
}
