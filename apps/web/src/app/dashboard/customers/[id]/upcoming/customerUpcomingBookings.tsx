import { pageClassName } from "@/components/page/pageCommons"
import { FindCustomerUpcomingBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "../customerDetailHeaderTabs"
import moment from "moment"
import {
  gridClassName,
  gridItemClassName,
} from "@/app/dashboard/bookings/(all)/bookingCommons"
import { Caption, CaptionGrey, PBold, PRed } from "@/components/typography"
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

  return (
    <div id="CustomerUpcomingBookingsPage" className={pageClassName}>
      <CustomerDetailHeaderTabs selectedTab={"Upcoming"} id={id} />
      <div
        id="CustomerUpcomingBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length > 0 ? (
          bookings.map((trip) => (
            <UpcomingBookingComponent key={trip.bookingId} {...trip} />
          ))
        ) : (
          <CaptionGrey>{t("NoBookings")}</CaptionGrey>
        )}
      </div>
    </div>
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
          <PBold>{props.customer}</PBold>
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
