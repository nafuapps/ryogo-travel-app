import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import { RyogoSmall } from "@/components/typography"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"

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
      <SectionColWrapper center>
        {bookingExpenses.length === 0 ? (
          <RyogoSmall color="slate">{t("NoExpenses")}</RyogoSmall>
        ) : (
          bookingExpenses.map((expense) => {
            return (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                canModifyExpense={canCreateExpense}
                canApproveExpense={canApproveExpense}
              />
            )
          })
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}
