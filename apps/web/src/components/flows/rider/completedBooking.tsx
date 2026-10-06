"use client"

import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { BOOKING_RATING_LIMIT_DAYS } from "@ryogo-travel-app/api/apiConfig"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { differenceInDays } from "date-fns"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import RateBookingByDriverDialog from "./rateBookingByDriverDialog"

export default function RiderMyCompletedBookingPageComponent({
  bookingDetails,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = useTranslations("Rider.MyBooking")
  const router = useRouter()

  return (
    <>
      {bookingDetails.ratingByDriver ||
      !bookingDetails.completedAt ||
      !bookingDetails.assignedDriver ||
      differenceInDays(new Date(), bookingDetails.completedAt) >
        BOOKING_RATING_LIMIT_DAYS ? (
        <RyogoDefaultButton
          label={t("Back")}
          className="w-full"
          onClick={() => router.back()}
        />
      ) : (
        <RateBookingByDriverDialog
          bookingId={bookingDetails.id}
          customerId={bookingDetails.customerId}
          agencyId={bookingDetails.agencyId}
          userId={bookingDetails.assignedDriver.userId}
        />
      )}
    </>
  )
}
