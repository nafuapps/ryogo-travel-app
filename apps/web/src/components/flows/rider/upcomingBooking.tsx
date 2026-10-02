"use client"

import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import StartTripSheet from "./tripSheets/startTripSheet"

export default function RiderMyUpcomingBookingPageComponent({
  bookingDetails,
  canStartTrip,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  canStartTrip: boolean
}) {
  const t = useTranslations("Rider.MyBooking")
  const router = useRouter()

  return (
    <>
      {canStartTrip ? (
        <StartTripSheet booking={bookingDetails} />
      ) : (
        <RyogoDefaultButton
          label={t("Back")}
          className="w-full"
          onClick={() => router.back()}
        />
      )}
    </>
  )
}
