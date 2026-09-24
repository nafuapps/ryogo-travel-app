"use client"

import { FindBookingTripLogsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import TripLogItem from "@/components/flows/bookings/tripLog/tripLogItem"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { usePagination } from "@/hooks/usePagination"
import { RyogoCaption } from "@/components/typography"
import { MapPinOff } from "lucide-react"
import { PaginationControls } from "@/components/pagination/paginationControls"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"

const TRIPLOGS_PER_PAGE = 10

export default function MyBookingTripLogsPageComponent({
  bookingTripLogs,
}: {
  bookingTripLogs: FindBookingTripLogsByIdType
}) {
  const t = useTranslations("Rider.MyBooking.TripLog")

  //Pagination of tripLogs
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(bookingTripLogs, TRIPLOGS_PER_PAGE)

  return (
    <>
      {bookingTripLogs.length > 0 ? (
        <SectionColWrapper className="self-center items-center w-full lg:max-w-3xl">
          <SectionRowWrapper className="w-full items-center justify-between">
            <RyogoCaption color="light">
              {t("TripLogs") + " (" + bookingTripLogs.length + ")"}
            </RyogoCaption>
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
