"use client"

import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import TripLogItem from "@/components/flows/bookings/tripLog/tripLogItem"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { Switch } from "@/components/ui/switch"

export default function BookingTripLogsPageComponent({
  bookingTripLogs,
}: {
  bookingTripLogs: FindBookingTripLogsByIdType
}) {
  const t = useTranslations("Dashboard.BookingTripLogs")
  const [showOther, setShowOther] = useState(false)

  const logs = showOther
    ? bookingTripLogs
    : bookingTripLogs.filter((t) => t.type !== TripLogTypesEnum.OTHER)

  return (
    <SectionColWrapper className="items-center">
      <SectionRowWrapper className="items-center">
        <RyogoCaption color="light">{t("ShowOther")}</RyogoCaption>
        <Switch checked={showOther} onCheckedChange={setShowOther} />
      </SectionRowWrapper>
      <SectionColWrapper className="w-full lg:max-w-3xl">
        {logs.length === 0 ? (
          <RyogoSmall color="slate">{t("NoTripLogs")}</RyogoSmall>
        ) : (
          logs.map((tripLog) => (
            <TripLogItem key={tripLog.id} tripLog={tripLog} />
          ))
        )}
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
