import { FindDriverAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "../driverDetailHeaderTabs"
import moment from "moment"
import {
  gridClassName,
  gridItemClassName,
  pageClassName,
} from "@/components/page/pageCommons"
import {
  Caption,
  CaptionBold,
  CaptionGrey,
  PBold,
  PRed,
} from "@/components/typography"
import Link from "next/link"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"
import { getCombinedDateTime } from "@/lib/utils"

export default async function DriverAssignedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverAssignedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.DriverAssignedBookings")
  const inProgressBookings = bookings.filter((b) => b.status)
  const upcomingBookings = bookings.filter((b) => !b.status)
  return (
    <div id="DriverAssignedBookingsPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      <div
        id="DriverAssignedBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length === 0 ? (
          <CaptionGrey>{t("NoBookings")}</CaptionGrey>
        ) : (
          <>
            {inProgressBookings.map((trip) => (
              <OngoingBookingComponent key={trip.bookingId} {...trip} />
            ))}
            {upcomingBookings.map((trip) => (
              <AssignedBookingComponent key={trip.bookingId} {...trip} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function OngoingBookingComponent(
  props: FindDriverAssignedBookingsByIdType[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`} className="w-full">
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </div>
        {props.status && (
          <div className={gridItemClassName}>
            <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
              <CaptionBold>{props.status.toUpperCase()}</CaptionBold>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

function AssignedBookingComponent(
  props: FindDriverAssignedBookingsByIdType[number],
) {
  const combinedDateTime = getCombinedDateTime(props.startDate, props.startTime)
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`} className="w-full">
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
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
    </Link>
  )
}
