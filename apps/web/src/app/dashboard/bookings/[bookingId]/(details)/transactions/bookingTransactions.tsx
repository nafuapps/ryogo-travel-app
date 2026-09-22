import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import Link from "next/link"
import {
  PageWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
  StickyActionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import TransactionItem from "@/components/flows/bookings/transaction/transactionItem"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { ArrowLeftRight } from "lucide-react"

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

  return (
    <PageWrapper id="BookingTransactionsPage">
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
      <SectionWrapper id="BookingTransactionsList">
        <SectionHeaderWrapper
          label={t("Title")}
          icon={ArrowLeftRight}
          count={bookingTransactions.length}
        />
        <TileGridWrapper>
          {bookingTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              canModifyTransaction={canCreateTransaction}
              isOwner={isOwner}
            />
          ))}
        </TileGridWrapper>
      </SectionWrapper>
      {canCreateTransaction && (
        <StickyActionWrapper>
          <Link href={`/dashboard/bookings/${bookingId}/transactions/new`}>
            <RyogoDefaultButton
              label={t("AddTransaction")}
              size={"lg"}
              className="w-full"
            />
          </Link>
        </StickyActionWrapper>
      )}
    </PageWrapper>
  )
}
