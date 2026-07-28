import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import BookingSection from "@/components/flows/bookings/details/bookingSection"
import BookingItem from "@/components/flows/bookings/details/bookingItem"
import { BriefcaseBusiness, Route } from "lucide-react"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import { BookingStatusPill } from "@/components/pills/ryogoPills"

export default async function RiderMyBookingDetails({
  booking,
  canCallCustomer,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canCallCustomer: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")
  return (
    <BookingGrid>
      <BookingSection sectionTitle={t("BookingInfo")} icon={BriefcaseBusiness}>
        <BookingItem title={t("BookingId")} value={booking.id} />
        <BookingItem title={t("CustomerName")} value={booking.customer.name} />
        <BookingStatusPill status={booking.status} />
        {booking.pickupAddress && (
          <BookingItem
            title={t("PickupAddress")}
            value={booking.pickupAddress}
          />
        )}
        {booking.startTime && (
          <BookingItem
            title={t("StartTime")}
            value={moment(booking.startTime, "hh:mm:ss").format("h:mm a")}
          />
        )}
        {booking.dropAddress && (
          <BookingItem title={t("DropAddress")} value={booking.dropAddress} />
        )}
        {canCallCustomer && (
          <>
            <RyogoPhoneButton
              label={t("CallCustomer")}
              phone={booking.customer.phone}
            />
            <RyogoChatButton
              label={t("ChatCustomer")}
              phone={booking.customer.phone}
            />
          </>
        )}
      </BookingSection>
      <BookingSection sectionTitle={t("TripInfo")} icon={Route}>
        <BookingItem
          title={t("From")}
          value={booking.source.city + ", " + booking.source.state}
        />
        <BookingItem
          title={t("To")}
          value={booking.destination.city + ", " + booking.destination.state}
        />
        <BookingItem
          title={t("StartDate")}
          value={moment(booking.startDate).format("DD MMM")}
        />
        <BookingItem
          title={t("EndDate")}
          value={moment(booking.endDate).format("DD MMM")}
        />
        <BookingItem
          title={t("Distance")}
          value={booking.citydistance + t("Km")}
        />
        <BookingItem
          title={t("TotalDistance")}
          value={booking.totalDistance + t("Km")}
        />
        <BookingItem title={t("Type")} value={booking.type.toUpperCase()} />
        <BookingItem
          title={t("Passengers")}
          value={booking.passengers.toString()}
        />
        <BookingItem
          title={t("NeedsAC")}
          value={booking.needsAc ? t("Yes") : t("No")}
        />
        {booking.remarks && (
          <BookingItem title={t("Remarks")} value={booking.remarks} />
        )}
      </BookingSection>
    </BookingGrid>
  )
}
