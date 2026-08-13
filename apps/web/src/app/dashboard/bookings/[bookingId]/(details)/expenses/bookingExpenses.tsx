import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookindDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Plus } from "lucide-react"

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
            <RyogoIcon icon={Plus} size="sm" color="slate" />
            <RyogoCaption>{t("AddExpense")}</RyogoCaption>
          </Button>
        </Link>
      )}
      <SectionColWrapper>
        {bookingExpenses.length === 0 ? (
          <RyogoSmall color="slate" className="text-center">
            {t("NoExpenses")}
          </RyogoSmall>
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
