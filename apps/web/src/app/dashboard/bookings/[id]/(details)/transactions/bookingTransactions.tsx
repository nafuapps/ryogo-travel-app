import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "@/components/header/bookingDetailHeaderTabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SmallGrey } from "@/components/typography"
import { PageWrapper } from "@/components/page/pageWrappers"
import TransactionItem from "@/components/bookings/transaction/transactionItem"

export default async function BookingTransactionsPageComponent({
  bookingId,
  bookingTransactions,
  canCreateTransaction,
  isOwner,
}: {
  bookingId: string
  bookingTransactions: FindBookingTransactionsByIdType
  canCreateTransaction: boolean
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")

  //TODO: Show booking details summary at the top
  return (
    <PageWrapper id="BookingTransactionsPage">
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
      {canCreateTransaction && (
        <Link
          href={`/dashboard/bookings/${bookingId}/transactions/new`}
          className="w-full md:w-1/2 self-center"
        >
          <Button variant={"outline"} className="w-full">
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
              isOwner={isOwner}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
