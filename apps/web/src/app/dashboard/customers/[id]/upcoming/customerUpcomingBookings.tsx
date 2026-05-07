import { FindCustomerUpcomingBookingsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/customerDetailHeaderTabs"
import moment from "moment"
import { RyogoCaption, RyogoP } from "@/components/typography"
import Link from "next/link"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"
import { getCombinedDateTime } from "@/lib/utils"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"

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
    <PageWrapper id="CustomerUpcomingBookingsPage">
      <CustomerDetailHeaderTabs selectedTab={"Upcoming"} id={id} />
      <div
        id="CustomerUpcomingBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length === 0 ? (
          <RyogoCaption color="light">{t("NoBookings")}</RyogoCaption>
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
    </PageWrapper>
  )
}

function OngoingBookingComponent(
  props: FindCustomerUpcomingBookingsByIdType[number],
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
        {props.status && (
          <GridItemWrapper>
            <TripLogStatusPill status={props.status} />
          </GridItemWrapper>
        )}
      </GridWrapper>
    </Link>
  )
}

function UpcomingBookingComponent(
  props: FindCustomerUpcomingBookingsByIdType[number],
) {
  const combinedDateTime = getCombinedDateTime(props.startDate, props.startTime)
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
            {format(combinedDateTime, "dd MMM hh:mm aaa")}
          </RyogoCaption>
          {combinedDateTime < new Date() ? (
            <RyogoP color="red">{moment(combinedDateTime).fromNow()}</RyogoP>
          ) : (
            <RyogoP weight="font-bold">
              {" "}
              {moment(combinedDateTime).fromNow()}
            </RyogoP> // <RyogoP weight="font-bold"> {startDate.fromNow()}</RyogoP>
          )}
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
