import { FindVehicleCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "../vehicleDetailHeaderTabs"
import { Caption, CaptionGrey, PBold } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"

export default async function VehicleCompletedBookingsPageComponent({
  bookings,
  id,
}: {
  bookings: FindVehicleCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.VehicleCompletedBookings")

  return (
    <PageWrapper id="VehicleCompletedBookingsPage">
      <VehicleDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <div
        id="VehicleCompletedBookingsList"
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
    </PageWrapper>
  )
}

function CompletedBookingComponent(
  props: FindVehicleCompletedBookingsByIdType[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`} className="w-full">
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{props.bookingId}</Caption>
          <PBold>{props.customerName}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{props.type.toUpperCase()}</Caption>
          <PBold>{props.route}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{props.vehicle}</Caption>
          <PBold>{props.driver}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{format(props.updatedAt, "PP")}</Caption>
          <PBold>{moment(props.updatedAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
