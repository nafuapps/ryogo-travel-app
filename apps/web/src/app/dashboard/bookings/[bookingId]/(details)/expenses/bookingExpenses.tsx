import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import Link from "next/link"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  StickyActionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import { BanknoteArrowDown } from "lucide-react"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default async function BookingExpensesPageComponent({
  bookingId,
  bookingExpenses,
  canEditExpense,
}: {
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
  canEditExpense: boolean
}) {
  const t = await getTranslations("Dashboard.BookingExpenses")

  return (
    <PageWrapper id="BookingExpensesPage">
      <BookindDetailHeaderTabs id={bookingId} selectedTab="Expenses" />
      <SectionWrapper id="BookingExpensesList">
        <SectionHeaderWrapper
          label={t("Title")}
          icon={BanknoteArrowDown}
          count={bookingExpenses.length}
        />
        <TileGridWrapper>
          {bookingExpenses.map((expense) => {
            return (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                canEditExpense={canEditExpense}
              />
            )
          })}
        </TileGridWrapper>
      </SectionWrapper>
      {canEditExpense && (
        <StickyActionWrapper>
          <Link href={`/dashboard/bookings/${bookingId}/expenses/new`}>
            <RyogoDefaultButton
              label={t("AddExpense")}
              size={"lg"}
              className="w-full"
            />
          </Link>
        </StickyActionWrapper>
      )}
    </PageWrapper>
  )
}
