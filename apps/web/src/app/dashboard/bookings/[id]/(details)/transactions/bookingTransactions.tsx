import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "../bookingDetailHeaderTabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TransactionItem from "./transactionItem"
import { SmallGrey } from "@/components/typography"

export default async function BookingTransactionsPageComponent({
  bookingId,
  bookingTransactions,
  canCreateTransaction,
}: {
  bookingId: string
  bookingTransactions: FindBookingTransactionsByIdType
  canCreateTransaction: boolean
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")

  //TODO: Show booking details summary at the top
  return (
    <div id="BookingTransactionsPage" className={pageClassName}>
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
      {canCreateTransaction && (
        <Link
          href={`/dashboard/bookings/${bookingId}/transactions/new`}
          className="min-w-1/2 self-center"
        >
          <Button variant={"default"} className="w-full">
            {t("AddTransaction")}
          </Button>
        </Link>
      )}
      {bookingTransactions.length === 0 ? (
        <div className="w-full text-center">
          <SmallGrey>{t("NoTransactions")}</SmallGrey>
        </div>
      ) : (
        <div
          id="BookingTransactionsInfo"
          className="flex flex-col gap-3 lg:gap-4 w-full"
        >
          {bookingTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              canModifyTransaction={canCreateTransaction}
            />
          ))}
        </div>
      )}
    </div>
  )
}
