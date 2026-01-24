import { pageClassName } from "@/components/page/pageCommons"
import { FindCustomerUpcomingBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "../customerDetailHeaderTabs"
import moment from "moment"
import {
  gridClassName,
  gridItemClassName,
} from "@/app/dashboard/components/pageCommons"
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

export default async function CustomerUpcomingBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindCustomerUpcomingBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.CustomerUpcomingBookings")
  const inProgressBookings = bookings.filter((b) => b.status)
  const upcomingBookings = bookings.filter((b) => !b.status)
  return (
    <div id="CustomerUpcomingBookingsPage" className={pageClassName}>
      <CustomerDetailHeaderTabs selectedTab={"Upcoming"} id={id} />
      <div
        id="CustomerUpcomingBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length == 0 ? (
          <CaptionGrey>{t("NoBookings")}</CaptionGrey>
        ) : (
          <>
            {inProgressBookings.map((trip) => (
              <OngoingBookingComponent key={trip.bookingId} {...trip} />
            ))}
            {upcomingBookings.map((trip) => (
              <UpcomingBookingComponent key={trip.bookingId} {...trip} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function OngoingBookingComponent(
  props: FindCustomerUpcomingBookingsByIdType[number],
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
        <div className={gridItemClassName}>
          <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>{props.status?.toUpperCase()}</CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}

function UpcomingBookingComponent(
  props: FindCustomerUpcomingBookingsByIdType[number],
) {
  const startDate = moment(props.startDate)
  const startTime = moment(props.startTime)
  startDate.hours(startTime.hours())
  startDate.minutes(startTime.minutes())
  startDate.seconds(startTime.seconds())
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
          <Caption>{format(props.startDate, "PP")}</Caption>
          {props.startDate < new Date() ? (
            <PRed>{startDate.fromNow()}</PRed>
          ) : (
            <PBold>{startDate.fromNow()}</PBold>
          )}
        </div>
      </div>
    </Link>
  )
}
