import { pageClassName } from "@/components/page/pageCommons"
import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import {
  gridClassName,
  gridItemClassName,
} from "../dashboard/components/pageCommons"
import Link from "next/link"
import {
  PBold,
  CaptionBold,
  Caption,
  PRed,
  CaptionLight,
  Small,
} from "@/components/typography"
import { format } from "date-fns"
import moment from "moment"
import { getTranslations } from "next-intl/server"

/**
 * - Show current booking (if any)
 * - Show upcoming bookings
 * TODO: Show important actions
 */
export default async function RiderHomePageComponent({
  assignedBookings,
}: {
  assignedBookings: FindDriverAssignedBookingsByIdType
}) {
  const t = await getTranslations("Rider.Home")
  const currentBooking = assignedBookings.find((booking) => booking.status)
  const upcomingBookings = assignedBookings.filter((booking) => !booking.status)
  return (
    <div id="RiderHomePage" className={pageClassName}>
      {currentBooking && <OngoingComponent booking={currentBooking} />}
      {upcomingBookings.length > 0 && (
        <div className="flex flex-col gap-2 lg:gap-3 bg-white rounded-lg p-3 lg:p-4">
          <Small>{t("Upcoming")}</Small>
          {upcomingBookings.map((b) => {
            return <UpcomingBookingsComponent key={b.bookingId} booking={b} />
          })}
        </div>
      )}
    </div>
  )
}

function OngoingComponent({
  booking,
}: {
  booking: FindDriverAssignedBookingsByIdType[number]
}) {
  return (
    <Link href={`/rider/myBookings/${booking.bookingId}`}>
      <div className="grid text-white bg-slate-900 rounded-lg grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1 gap-3 lg:gap-4 p-3 lg:p-4 hover:bg-slate-800">
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
    </Link>
  )
}

function UpcomingBookingsComponent({
  booking,
}: {
  booking: FindDriverAssignedBookingsByIdType[number]
}) {
  const startDate = moment(booking.startDate)
  const startTime = moment(booking.startTime)
  startDate.hours(startTime.hours())
  startDate.minutes(startTime.minutes())
  startDate.seconds(startTime.seconds())
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
          <Caption>{format(booking.startDate, "PP")}</Caption>
          {booking.startDate < new Date() ? (
            <PRed>{startDate.fromNow()}</PRed>
          ) : (
            <PBold>{startDate.fromNow()}</PBold>
          )}
        </div>
      </div>
    </Link>
  )
}
