import { pageClassName } from "@/components/page/pageCommons"
import {
  bookingServices,
  FindBookingExpensesByIdType,
} from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "../bookingDetailHeaderTabs"

export default async function BookingExpensesPageComponent({
  bookingId,
  bookingExpenses,
}: {
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
}) {
  const t = await getTranslations("Dashboard.BookingExpenses")

  return (
    <div id="BookingExpensesPage" className={pageClassName}>
      <BookindDetailHeaderTabs id={bookingId} selectedTab="Expenses" />
    </div>
  )
}
