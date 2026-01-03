import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"

/**
 *
 * 1. Approve transactions
 * 2. Approve expenses
 * 3.
 */

export default async function ReconcileBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.ReconcileBooking")

  return <div></div>
}
