import {
  gridItemClassName,
  gridClassName,
  pageClassName,
} from "@/components/page/pageCommons"
import {
  Small,
  CaptionLight,
  PBold,
  CaptionBold,
  PRed,
  Caption,
  SmallLight,
} from "@/components/typography"
import {
  FindDriverAssignedBookingsByIdType,
  FindDriverByUserIdType,
  FindDriverCompletedBookingsByIdType,
} from "@ryogo-travel-app/api/services/driver.services"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import { format } from "date-fns"
import Link from "next/link"
import { LucideChevronRight } from "lucide-react"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { getCombinedDateTime } from "@/lib/utils"

export default async function RiderMyBookingsPageComponent({
  assignedBookings,
  completedBookings,
  driver,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
  completedBookings: FindDriverCompletedBookingsByIdType
  driver: FindDriverByUserIdType
}) {
  const t = await getTranslations("Rider.MyBookings")
  //Get in progress booking (if any)
  const currentBooking = assignedBookings.find((booking) => booking.status)
  //Get atmost 3 upcoming bookings
  const upcomingBookings = assignedBookings
    .filter((booking) => !booking.status)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 3)

  return (
    <div id="RiderHomePage" className={pageClassName}>
      {currentBooking && (
        <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
          <Small>{t("Ongoing")}</Small>
          <OngoingBookingComponent booking={currentBooking} />
        </div>
      )}
      {upcomingBookings.length > 0 && (
        <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
          <Small>{t("Upcoming")}</Small>
          {upcomingBookings.map((b, i) => {
            return (
              <UpcomingBookingComponent
                key={b.bookingId}
                booking={b}
                canStart={
                  driver?.status == DriverStatusEnum.AVAILABLE &&
                  !currentBooking &&
                  b.startDate <= new Date() &&
                  i == 0
                }
              />
            )
          })}
        </div>
      )}
      {completedBookings.length > 0 && (
        <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
          <Small>{t("Completed")}</Small>
          {completedBookings.map((b) => {
            return <CompletedBookingComponent key={b.bookingId} booking={b} />
          })}
        </div>
      )}
    </div>
  )
}

async function OngoingBookingComponent({
  booking,
}: {
  booking: FindDriverAssignedBookingsByIdType[number]
}) {
  const t = await getTranslations("Rider.Home")
  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`}>
      <div
        className={`grid text-white bg-slate-900 rounded-t-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-800`}
      >
        <div className={gridItemClassName}>
          <CaptionLight>{booking.bookingId}</CaptionLight>
          <PBold>{booking.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <CaptionLight>{booking.type.toUpperCase()}</CaptionLight>
          <PBold>{booking.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <CaptionLight>{booking.vehicle}</CaptionLight>
          <PBold>{booking.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>{booking.status?.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
      <div className="bg-slate-600 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 p-2 lg:p-3">
        <SmallLight>{t("Continue")}</SmallLight>
        <LucideChevronRight className="size-5 lg:size-6 text-slate-100" />
      </div>
    </Link>
  )
}

async function UpcomingBookingComponent({
  booking,
  canStart,
}: {
  booking: FindDriverAssignedBookingsByIdType[number]
  canStart: boolean
}) {
  const t = await getTranslations("Rider.Home")
  const combinedDateTime = getCombinedDateTime(
    booking.startDate,
    booking.startTime!,
  )
  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`} className="w-full">
      <div
        className={`grid border border-slate-100 ${canStart ? "rounded-t-lg" : "rounded-lg"} grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-100`}
      >
        <div className={gridItemClassName}>
          <Caption>{booking.bookingId}</Caption>
          <PBold>{booking.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <PBold>{booking.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.vehicle}</Caption>
          <PBold>{booking.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{format(combinedDateTime, "dd MMM hh:mm aaa")}</Caption>
          {combinedDateTime < new Date() ? (
            <PRed>{moment(combinedDateTime).fromNow()}</PRed>
          ) : (
            <PBold>{moment(combinedDateTime).fromNow()}</PBold> // <PBold>{startDate.fromNow()}</PBold>
          )}
        </div>
      </div>
      {canStart && (
        <div className="bg-slate-200 col-span-2 rounded-b-lg flex items-center justify-center gap-1 lg:gap-1.5 p-2 lg:p-3">
          <Small>{t("Start")}</Small>
          <LucideChevronRight className="size-5 lg:size-6 text-slate-700" />
        </div>
      )}
    </Link>
  )
}

function CompletedBookingComponent({
  booking,
}: {
  booking: FindDriverCompletedBookingsByIdType[number]
}) {
  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`} className="w-full">
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{booking.bookingId}</Caption>
          <PBold>{booking.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <PBold>{booking.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.vehicle}</Caption>
          <PBold>{booking.driver}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{format(booking.updatedAt, "PP")}</Caption>
          <PBold>{moment(booking.updatedAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}
