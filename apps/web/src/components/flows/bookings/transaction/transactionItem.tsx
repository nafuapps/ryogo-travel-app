import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import { Maximize2, Minimize2 } from "lucide-react"
import { format } from "date-fns"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { TransactionApprovalButton } from "./transactionApprovalButton"
import { RyogoChinImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoIconButton } from "@/components/buttons/ryogoButtons"

export default async function TransactionItem({
  transaction,
  canModifyTransaction,
  isOwner,
}: {
  transaction: NonNullable<FindBookingTransactionsByIdType>[0]
  canModifyTransaction: boolean
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")
  const id = transaction.bookingId
  const txnId = transaction.id

  let fileUrl = ""
  if (transaction.transactionPhotoUrl) {
    fileUrl = getFileUrl(transaction.transactionPhotoUrl)
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${
          transaction.transactionPhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <div className="flex flex-col gap-1.5 lg:gap-2 min-w-1/5">
          {transaction.type === TransactionTypesEnum.DEBIT ? (
            <div className="flex size-7 lg:size-8 bg-red-100 rounded-full items-center justify-center">
              <RyogoIcon icon={Maximize2} size="sm" color="red" />
            </div>
          ) : (
            <div className="flex size-7 lg:size-8 bg-green-100 rounded-full items-center justify-center">
              <RyogoIcon icon={Minimize2} size="sm" color="green" />
            </div>
          )}
          {transaction.type === TransactionTypesEnum.DEBIT ? (
            <RyogoSmall color="red">
              {transaction.otherParty.toUpperCase()}
            </RyogoSmall>
          ) : (
            <RyogoSmall>{transaction.otherParty.toUpperCase()}</RyogoSmall>
          )}
          <RyogoCaption color="light">{transaction.id}</RyogoCaption>
        </div>
        <div className="flex flex-col gap-2 lg:gap-3 w-full">
          <RyogoSmall weight="font-bold">
            {transaction.mode.toUpperCase()}
          </RyogoSmall>
          {transaction.remarks && (
            <RyogoCaption color="slate">{transaction.remarks}</RyogoCaption>
          )}
          <RyogoCaption color="light">
            {format(transaction.createdAt, "dd MMM hh:mm aaa")}
          </RyogoCaption>
          <RyogoCaption color="light">
            {transaction.addedByUser.name}
          </RyogoCaption>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row items-end justify-between lg:items-center lg:justify-end">
          <div className="flex gap-2 lg:gap-3 justify-end lg:items-center">
            <RyogoH3>{transaction.amount}</RyogoH3>
          </div>
          <div className="flex flex-row gap-2 lg:gap-3">
            {isOwner && (
              <TransactionApprovalButton
                txnId={txnId}
                isApproved={transaction.isApproved}
                agencyId={transaction.agencyId}
              />
            )}
            {canModifyTransaction && (
              <Link
                href={`/dashboard/bookings/${id}/transactions/modify/${txnId}`}
              >
                <RyogoIconButton label={t("Modify")} />
              </Link>
            )}
          </div>
        </div>
      </div>
      {transaction.transactionPhotoUrl && (
        <RyogoChinImage src={fileUrl} alt={t("Proof")} />
      )}
    </div>
  )
}
