"use client"

import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { RyogoCaption } from "@/components/typography"
import TripLogItem from "@/components/flows/bookings/tripLog/tripLogItem"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { Switch } from "@/components/ui/switch"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { MapPinOff } from "lucide-react"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

const TRIPLOGS_PER_PAGE = 10

export default function BookingTripLogsPageComponent({
  bookingTripLogs,
}: {
  bookingTripLogs: FindBookingTripLogsByIdType
}) {
  const t = useTranslations("Dashboard.BookingTripLogs")
  const [showOther, setShowOther] = useState(false)

  const filteredLogs = showOther
    ? bookingTripLogs
    : bookingTripLogs.filter((t) => t.type !== TripLogTypesEnum.OTHER)

  //Pagination of tripLogs
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredLogs, TRIPLOGS_PER_PAGE)

  return (
    <>
      {bookingTripLogs.length > 0 ? (
        <SectionColWrapper className="self-center items-center w-full">
          <SectionRowWrapper className="w-full items-center justify-between">
            <RyogoCaption color="light">
              {t("FilteredLogs") + " (" + filteredLogs.length + ")"}
            </RyogoCaption>
            <SectionRowWrapper className="items-center justify-end">
              <RyogoCaption color="light">{t("ShowOther")}</RyogoCaption>
              <Switch checked={showOther} onCheckedChange={setShowOther} />
            </SectionRowWrapper>
          </SectionRowWrapper>
          {currentItems.map((tripLog) => (
            <TripLogItem key={tripLog.id} tripLog={tripLog} />
          ))}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </SectionColWrapper>
      ) : (
        <EmptyStateIcon icon={MapPinOff} label={t("NoTriplogs")} />
      )}
    </>
  )
}
