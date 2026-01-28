import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "../driverDetailHeaderTabs"
import {
  gridClassName,
  gridItemClassName,
  pageClassName,
} from "@/components/page/pageCommons"
import { Caption, CaptionGrey, PBold } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

export default async function DriverCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.DriverCompletedBookings")

  return (
    <div id="DriverCompletedBookingsPage" className={pageClassName}>
      <DriverDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <div
        id="DriverCompletedBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length > 0 ? (
          bookings.map((trip) => (
            <CompletedBookingComponent key={trip.bookingId} {...trip} />
          ))
        ) : (
          <CaptionGrey>{t("NoBookings")}</CaptionGrey>
        )}
      </div>
    </div>
  )
}

function CompletedBookingComponent(
  props: FindDriverCompletedBookingsByIdType[number],
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
          <Caption>{format(props.updatedAt, "PP")}</Caption>
          <PBold>{moment(props.updatedAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}
