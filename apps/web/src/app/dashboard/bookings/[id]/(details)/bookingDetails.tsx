import { pageClassName } from "@/components/page/pageCommons"
import {
  bookingServices,
  FindBookingDetailsByIdType,
} from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "./bookingDetailHeaderTabs"
import { P, CaptionGrey, SmallBold } from "@/components/typography"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import moment from "moment"

export default async function BookingDetailsPageComponent({
  bookingId,
  bookingDetails,
  isOwner,
}: {
  bookingId: string
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  console.log(bookingDetails.startTime)

  return (
    <div id="BookingDetailsPage" className={pageClassName}>
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Details" />
      <div
        id="BookingDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <BookingDetailsSection sectionTitle={t("BookingInfo")}>
          <BookingDetailsItem
            title={t("BookingId")}
            value={bookingDetails.id}
          />
          <BookingDetailsItem
            title={t("Created")}
            value={format(bookingDetails.createdAt, "dd MMM hh:mm aaa")}
          />
          <BookingDetailsItem
            title={t("Status")}
            value={bookingDetails.status.toUpperCase()}
          />
          <BookingDetailsItem
            title={t("BookedBy")}
            value={bookingDetails.bookedByUser.name}
          />
          <BookingDetailsItem
            title={t("AssignedTo")}
            value={bookingDetails.assignedUser.name}
          />
          {isOwner && (
            <Button
              variant={"secondary"}
              className="sm:col-span-2 xl:col-span-3"
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-user`}
                className="w-full"
              >
                {t("AssignAgent")}
              </Link>
            </Button>
          )}
        </BookingDetailsSection>
        <Separator />
        <BookingDetailsSection sectionTitle={t("CustomerInfo")}>
          <BookingDetailsItem
            title={t("CustomerName")}
            value={bookingDetails.customer.name}
          />
          <BookingDetailsItem
            title={t("CustomerLocation")}
            value={
              bookingDetails.customer.location.city +
              ", " +
              bookingDetails.customer.location.state
            }
          />
          <BookingDetailsItem
            title={t("CustomerPhone")}
            value={bookingDetails.customer.phone}
          />
          {bookingDetails.customer.address && (
            <BookingDetailsItem
              title={t("CustomerAddress")}
              value={bookingDetails.customer.address}
            />
          )}
          {bookingDetails.customer.remarks && (
            <BookingDetailsItem
              title={t("CustomerRemarks")}
              value={bookingDetails.customer.remarks}
            />
          )}
        </BookingDetailsSection>
        <Separator />
        <BookingDetailsSection sectionTitle={t("TripInfo")}>
          <BookingDetailsItem
            title={t("From")}
            value={
              bookingDetails.source.city + ", " + bookingDetails.source.state
            }
          />
          <BookingDetailsItem
            title={t("To")}
            value={
              bookingDetails.destination.city +
              ", " +
              bookingDetails.destination.state
            }
          />
          <BookingDetailsItem
            title={t("StartDate")}
            value={moment(bookingDetails.startDate).format("DD MMM")}
          />
          <BookingDetailsItem
            title={t("EndDate")}
            value={moment(bookingDetails.endDate).format("DD MMM")}
          />
          <BookingDetailsItem
            title={t("Distance")}
            value={bookingDetails.citydistance + t("Km")}
          />
          <BookingDetailsItem
            title={t("Type")}
            value={bookingDetails.type.toUpperCase()}
          />
          <BookingDetailsItem
            title={t("Passengers")}
            value={bookingDetails.passengers.toString()}
          />
          <BookingDetailsItem
            title={t("NeedsAC")}
            value={bookingDetails.needsAc ? t("Yes") : t("No")}
          />
          <BookingDetailsItem
            title={t("PickupAddress")}
            value={bookingDetails.pickupAddress!}
          />
          <BookingDetailsItem
            title={t("DropAddress")}
            value={bookingDetails.dropAddress!}
          />
          <BookingDetailsItem
            title={t("StartTime")}
            value={moment(bookingDetails.startTime!).format("h:mm a")}
          />
        </BookingDetailsSection>
      </div>
    </div>
  )
}

type BookingDetailsSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
const BookingDetailsSection = (props: BookingDetailsSectionType) => {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-center">
        {props.children}
      </div>
    </div>
  )
}

type BookingDetailsItemType = {
  title: string
  value: string
}
const BookingDetailsItem = (props: BookingDetailsItemType) => {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0.5 lg:gap-1 last:text-end sm:last:text-start">
      <CaptionGrey>{props.title}</CaptionGrey>
      <P>{props.value}</P>
    </div>
  )
}
