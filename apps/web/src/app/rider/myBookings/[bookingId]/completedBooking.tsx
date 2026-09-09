import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default async function RiderMyCompletedBookingPageComponent() {
  const t = await getTranslations("Rider.MyBooking")

  return (
    <Link href="/rider/myBookings">
      <RyogoOutlineButton label={t("Back")} className="w-full" />
    </Link>
  )
}
