import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "../bookingDetailHeaderTabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import TransactionItem from "./transactionItem"

export default async function BookingTransactionsPageComponent({
  bookingId,
  bookingTransactions,
  isOwner,
  isAssignedUser,
}: {
  bookingId: string
  bookingTransactions: FindBookingTransactionsByIdType
  isOwner: boolean
  isAssignedUser: boolean
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")

  //TODO: Show booking details summary at the top
  return (
    <div id="BookingTransactionsPage" className={pageClassName}>
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
      {(isOwner || isAssignedUser) && (
        <Link href={`/dashboard/bookings/${bookingId}/transactions/new`}>
          <Button variant={"default"} className="w-full self-center">
            {t("AddTransaction")}
          </Button>
        </Link>
      )}
      {bookingTransactions.length === 0 ? (
        <p>{t("NoTransactions")}</p>
      ) : (
        <div
          id="BookingTransactionsInfo"
          className="flex flex-col gap-3 lg:gap-4 w-full"
        >
          {bookingTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  )
}
