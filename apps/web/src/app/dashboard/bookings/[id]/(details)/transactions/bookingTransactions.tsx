import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RyogoSmall } from "@/components/typography"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import TransactionItem from "@/components/flows/bookings/transaction/transactionItem"

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
      <SectionColWrapper center>
        {bookingTransactions.length === 0 ? (
          <RyogoSmall color="slate">{t("NoTransactions")}</RyogoSmall>
        ) : (
          bookingTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              canModifyTransaction={canCreateTransaction}
              isOwner={isOwner}
            />
          ))
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}
