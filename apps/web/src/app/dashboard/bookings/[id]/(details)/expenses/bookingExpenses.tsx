import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "../bookingDetailHeaderTabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ExpenseItem from "./expenseItem"
import { SmallGrey } from "@/components/typography"
import { PageWrapper } from "@/components/page/pageWrappers"

export default async function BookingExpensesPageComponent({
  bookingId,
  bookingExpenses,
  canCreateExpense,
  canApproveExpense,
}: {
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
  canCreateExpense: boolean
  canApproveExpense: boolean
}) {
  const t = await getTranslations("Dashboard.BookingExpenses")

  return (
    <PageWrapper id="BookingExpensesPage">
      <BookindDetailHeaderTabs id={bookingId} selectedTab="Expenses" />
      {canCreateExpense && (
        <Link
          href={`/dashboard/bookings/${bookingId}/expenses/new`}
          className="w-full md:w-1/2 self-center"
        >
          <Button variant={"outline"} className="w-full">
            {t("AddExpense")}
          </Button>
        </Link>
      )}
      {bookingExpenses.length === 0 ? (
        <div className="w-full text-center">
          <SmallGrey>{t("NoExpenses")}</SmallGrey>
        </div>
      ) : (
        <div
          id="BookingExpensesInfo"
          className="flex flex-col gap-3 lg:gap-4 w-full"
        >
          {bookingExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              canModifyExpense={canCreateExpense}
              canApproveExpense={canApproveExpense}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
