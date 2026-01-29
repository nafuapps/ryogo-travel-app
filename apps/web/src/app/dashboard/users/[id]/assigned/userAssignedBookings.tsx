import UserDetailHeaderTabs from "../userDetailHeaderTabs"
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
import { FindUserAssignedBookingsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getCombinedDateTime } from "@/lib/utils"

export default async function UserAssignedPageComponent({
  bookings,
  id,
}: {
  bookings: FindUserAssignedBookingsByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.UserAssignedBookings")
  const inProgressBookings = bookings.filter((b) => b.status)
  const assignedBookings = bookings.filter((b) => !b.status)
  return (
    <div id="UserAssignedBookingsPage" className={pageClassName}>
      <UserDetailHeaderTabs selectedTab={"Assigned"} id={id} />
      <div
        id="UserAssignedBookingsList"
        className="flex flex-col items-center gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        {bookings.length == 0 ? (
          <CaptionGrey>{t("NoBookings")}</CaptionGrey>
        ) : (
          <>
            {inProgressBookings.map((trip) => (
              <OngoingBookingComponent key={trip.bookingId} {...trip} />
            ))}
            {assignedBookings.map((trip) => (
              <AssignedBookingComponent key={trip.bookingId} {...trip} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function OngoingBookingComponent(
  props: FindUserAssignedBookingsByIdType[number],
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

function AssignedBookingComponent(
  props: FindUserAssignedBookingsByIdType[number],
) {
  const combinedDateTime = getCombinedDateTime(
    props.startDate,
    props.startTime!,
  )
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
