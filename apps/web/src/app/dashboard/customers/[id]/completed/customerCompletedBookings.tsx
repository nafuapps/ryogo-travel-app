import {
  gridClassName,
  gridItemClassName,
  pageClassName,
} from "@/components/page/pageCommons"
import { FindCustomerCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "../customerDetailHeaderTabs"
import { Caption, CaptionGrey, PBold } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

export default async function CustomerCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindCustomerCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.CustomerCompletedBookings")

  return (
    <div id="CustomerCompletedBookingsPage" className={pageClassName}>
      <CustomerDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <div
        id="CustomerCompletedBookingsList"
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
  props: FindCustomerCompletedBookingsByIdType[number],
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
