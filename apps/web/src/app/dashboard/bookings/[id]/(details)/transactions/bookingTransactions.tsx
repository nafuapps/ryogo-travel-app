import { pageClassName } from "@/components/page/pageCommons"
import {
  bookingServices,
  FindBookingTransactionsByIdType,
} from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "../bookingDetailHeaderTabs"

export default async function BookingTransactionsPageComponent({
  bookingId,
  bookingTransactions,
}: {
  bookingId: string
  bookingTransactions: FindBookingTransactionsByIdType
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")

  return (
    <div id="BookingTransactionsPage" className={pageClassName}>
      <BookindDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
    </div>
  )
}
