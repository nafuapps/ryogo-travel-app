import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import StartTripSheet from "@/components/flows/rider/tripSheets/startTripSheet"
import Link from "next/link"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { getTranslations } from "next-intl/server"

export default async function RiderMyUpcomingBookingPageComponent({
  booking,
  canStartTrip,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  canStartTrip: boolean
}) {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <>
      {canStartTrip && <StartTripSheet booking={booking} />}
      <Link href="/rider/myBookings">
        <RyogoOutlineButton label={t("Back")} className="w-full" />
      </Link>
    </>
  )
}
