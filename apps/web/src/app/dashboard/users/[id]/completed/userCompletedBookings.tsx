import { FindDriverCompletedBookingsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import { RyogoCaption, RyogoP } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"
import UserDetailHeaderTabs from "@/components/header/userDetailHeaderTabs"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"

export default async function UserCompletedPageComponent({
  bookings,
  id,
}: {
  bookings: FindDriverCompletedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.DriverCompletedBookings")

  return (
    <PageWrapper id="DriverCompletedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Completed"} id={id} />
      <div
        id="DriverCompletedBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length > 0 ? (
          bookings.map((trip) => (
            <CompletedBookingComponent key={trip.bookingId} {...trip} />
          ))
        ) : (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
        )}
      </div>
    </PageWrapper>
  )
}

function CompletedBookingComponent(
  props: FindDriverCompletedBookingsByIdType[number],
) {
  return (
    <Link href={`/dashboard/bookings/${props.bookingId}`} className="w-full">
      <GridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.customerName}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.type.toUpperCase()}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.route}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{props.vehicle}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.driver}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {format(props.updatedAt, "PP")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(props.updatedAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
