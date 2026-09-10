import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { RyogoSmall } from "@/components/typography"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import { Plus } from "lucide-react"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import RiderExpenseItem from "@/components/flows/rider/riderExpenseItem"
import MyBookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/myBookingDetailHeaderTabs"

export default async function MyBookingExpensesPageComponent({
  userId,
  bookingId,
  bookingExpenses,
  canCreateExpense,
}: {
  userId: string
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
  canCreateExpense: boolean
}) {
  const t = await getTranslations("Rider.MyBooking.Expense")

  return (
    <PageWrapper id="BookingExpensesPage">
      <MyBookingDetailHeaderTabs id={bookingId} selectedTab={"Expenses"} />
      {canCreateExpense && (
        <Link
          href={`/rider/myBookings/${bookingId}/expenses/add`}
          className="w-full md:w-1/2 self-center"
        >
          <RyogoOutlineButton label={t("AddExpense")} className="w-full">
            <RyogoIcon icon={Plus} size="sm" />
          </RyogoOutlineButton>
        </Link>
      )}
      <SectionColWrapper>
        {bookingExpenses.length === 0 ? (
          <RyogoSmall color="slate" className="text-center">
            {t("NoExpense")}
          </RyogoSmall>
        ) : (
          bookingExpenses.map((expense) => {
            return (
              <RiderExpenseItem
                key={expense.id}
                bookingId={bookingId}
                expense={expense}
                canModifyExpense={userId === expense.addedByUserId}
              />
            )
          })
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}
