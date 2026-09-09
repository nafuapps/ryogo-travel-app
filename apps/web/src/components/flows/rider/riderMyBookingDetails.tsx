import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingSection from "@/components/flows/bookings/details/bookingSection"
import {
  BriefcaseBusiness,
  ClipboardClock,
  Contact,
  MapPinCheck,
  MapPinHouse,
  MessageSquarePlus,
  Route,
  UserKey,
} from "lucide-react"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import BookingActionWrapper from "@/components/flows/bookings/details/bookingActionWrapper"
import BookingAssignedUserCard from "@/components/flows/bookings/details/bookingAssignedUserCard"
import BookingIDWrapper from "@/components/flows/bookings/details/BookingIDWrapper"
import BookingCreationInfoCard from "@/components/flows/bookings/details/bookingInfoCard"
import BookingRatingWrapper from "@/components/flows/bookings/details/bookingRatingCard"
import BookingCustomerCard from "@/components/flows/bookings/details/bookingCustomerCard"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import { BookingEditTripInfoWrapper } from "@/components/flows/bookings/details/bookingDetailsCommon"
import { getDisplayTime } from "@/lib/utils"

export default async function RiderMybooking({
  booking,
  canCommunicateWithCustomer,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canCommunicateWithCustomer: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")

  const isConfirmed = booking.status === BookingStatusEnum.CONFIRMED
  const isInProgress = booking.status === BookingStatusEnum.IN_PROGRESS
  const isCompleted = booking.status === BookingStatusEnum.COMPLETED

  const canSeeTripDetails = isConfirmed || isInProgress

  return (
    <BookingGrid>
      <BookingSection sectionTitle={t("BookingInfo")} icon={BriefcaseBusiness}>
        <BookingIDWrapper id={booking.id} status={booking.status} />
        <BookingCreationInfoCard
          name={booking.bookedByUser.name}
          photoUrl={booking.bookedByUser.photoUrl}
          createdAt={booking.createdAt}
        />
        {isCompleted && (
          <BookingRatingWrapper
            ratingByCustomer={booking.ratingByCustomer}
            ratingByDriver={booking.ratingByDriver}
          />
        )}
      </BookingSection>
      <BookingSection sectionTitle={t("TripInfo")} icon={Route}>
        <BookingTripCard booking={booking} />
        {canSeeTripDetails && (
          <>
            {booking.startTime && (
              <BookingEditTripInfoWrapper
                icon={ClipboardClock}
                label={t("StartTime")}
                value={getDisplayTime(booking.startTime)}
                canEdit={false}
              />
            )}
            {booking.pickupAddress && (
              <BookingEditTripInfoWrapper
                label={t("PickupAddress")}
                value={booking.pickupAddress}
                icon={MapPinHouse}
                canEdit={false}
              />
            )}
            {booking.dropAddress && (
              <BookingEditTripInfoWrapper
                label={t("DropAddress")}
                value={booking.dropAddress}
                canEdit={false}
                icon={MapPinCheck}
              />
            )}
          </>
        )}
        {booking.remarks && (
          <BookingEditTripInfoWrapper
            label={t("Remarks")}
            value={booking.remarks}
            canEdit={false}
            icon={MessageSquarePlus}
          />
        )}
      </BookingSection>
      <BookingSection sectionTitle={t("AssignedUserInfo")} icon={UserKey}>
        <BookingAssignedUserCard user={booking.assignedUser} />
        <BookingActionWrapper>
          <RyogoPhoneButton
            label={t("CallAssignedUser")}
            phone={booking.assignedUser.phone}
          />
          <RyogoChatButton
            label={t("ChatAssignedUser.Title")}
            phone={booking.assignedUser.phone}
            subtitle={t("ChatAssignedUser.Subtitle")}
          />
        </BookingActionWrapper>
      </BookingSection>
      <BookingSection sectionTitle={t("CustomerInfo")} icon={Contact}>
        <BookingCustomerCard
          customer={booking.customer}
          hidePhone={!canCommunicateWithCustomer}
        />
        {canCommunicateWithCustomer && (
          <BookingActionWrapper>
            <RyogoPhoneButton
              label={t("CallCustomer")}
              phone={booking.customer.phone}
            />
            <RyogoChatButton
              label={t("ChatCustomer.Title")}
              phone={booking.customer.phone}
              subtitle={t("ChatCustomer.Subtitle")}
            />
          </BookingActionWrapper>
        )}
      </BookingSection>
    </BookingGrid>
  )
}
