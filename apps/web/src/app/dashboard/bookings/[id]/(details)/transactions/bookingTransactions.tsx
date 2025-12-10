import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "../bookingDetailHeaderTabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CaptionGrey,
  SmallGrey,
  SmallRed,
  Small,
  H4,
} from "@/components/typography"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import { LucideMaximize2, LucideMinimize2 } from "lucide-react"

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

  return (
    <div id="BookingTransactionsPage" className={pageClassName}>
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
      {(isOwner || isAssignedUser) && (
        <Link href={`/dashboard/bookings/${bookingId}/transactions/new`}>
          <Button variant={"outline"} className="w-full sm:w-1/2 self-center">
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

async function TransactionItem({
  transaction,
}: {
  transaction: NonNullable<FindBookingTransactionsByIdType>[0]
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")
  const id = transaction.bookingId
  const txnId = transaction.id
  return (
    <div className="bg-white p-3 lg:p-4 rounded-lg gap-2 lg:gap-3 flex flex-col lg:flex-row lg:items-center justify-between">
      <div className="flex flex-row justify-between gap-2 lg:gap-3 items-center w-full">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 justify-between lg:items-center">
          {transaction.type == TransactionTypesEnum.DEBIT ? (
            <div className="flex size-7 lg:size-9 bg-red-100 rounded-full items-center justify-center">
              <LucideMaximize2 className="size-4 lg:size-6 text-red-400" />
            </div>
          ) : (
            <div className="flex size-7 lg:size-9 bg-green-100 rounded-full items-center justify-center">
              <LucideMinimize2 className="size-4 lg:size-6 text-green-400" />
            </div>
          )}
          {transaction.type == TransactionTypesEnum.DEBIT ? (
            <SmallRed>{transaction.otherParty.toUpperCase()}</SmallRed>
          ) : (
            <Small>{transaction.otherParty.toUpperCase()}</Small>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 justify-between lg:items-center">
          <SmallGrey>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </SmallGrey>
          <CaptionGrey>{transaction.mode.toUpperCase()}</CaptionGrey>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 justify-between lg:items-center">
          <H4>{transaction.amount}</H4>
        </div>
      </div>
      <CaptionGrey>{transaction.remarks}</CaptionGrey>
      <Link href={`/dashboard/bookings/${id}/transactions/modify/${txnId}`}>
        <Button variant={"secondary"} className="w-full">
          {t("Modify")}
        </Button>
      </Link>
    </div>
  )
}
