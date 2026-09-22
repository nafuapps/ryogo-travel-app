import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  TileGridWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { BanknoteArrowDown } from "lucide-react"
import MyBookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/myBookingDetailHeaderTabs"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default async function MyBookingExpensesPageComponent({
  userId,
  bookingId,
  bookingExpenses,
  canAddExpense,
}: {
  userId: string
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
  canAddExpense: boolean
}) {
  const t = await getTranslations("Rider.MyBookingExpenses")

  return (
    <PageWrapper id="RiderBookingExpensesPage">
      <MyBookingDetailHeaderTabs id={bookingId} selectedTab={"Expenses"} />
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
                canEditExpense={userId === expense.addedByUserId}
                isRider
              />
            )
          })}
        </TileGridWrapper>
      </SectionWrapper>
      {canAddExpense && (
        <StickyActionWrapper>
          <Link href={`/rider/myBookings/${bookingId}/expenses/add`}>
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
