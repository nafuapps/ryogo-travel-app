import {
  CaptionGrey,
  H4,
  Caption,
  SmallBold,
  Small,
  SmallRed,
} from "@/components/typography"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import { LucideMaximize2, LucideMinimize2, LucidePencil } from "lucide-react"
import { format } from "date-fns"
import { UrlObject } from "url"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { TransactionApprovalButton } from "./transactionApprovalButton"

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
        <div className="flex flex-col gap-1.5 lg:gap-2 justify-start min-w-1/5">
          {transaction.type == TransactionTypesEnum.DEBIT ? (
            <div className="flex size-7 lg:size-8 bg-red-100 rounded-full items-center justify-center">
              <LucideMaximize2 className="size-4 lg:size-5 text-red-400" />
            </div>
          ) : (
            <div className="flex size-7 lg:size-8 bg-green-100 rounded-full items-center justify-center">
              <LucideMinimize2 className="size-4 lg:size-5 text-green-400" />
            </div>
          )}
          {transaction.type == TransactionTypesEnum.DEBIT ? (
            <SmallRed>{transaction.otherParty.toUpperCase()}</SmallRed>
          ) : (
            <Small>{transaction.otherParty.toUpperCase()}</Small>
          )}
          <CaptionGrey>{transaction.id}</CaptionGrey>
        </div>
        <div className="flex flex-col gap-2 lg:gap-3 w-full">
          <SmallBold>{transaction.mode.toUpperCase()}</SmallBold>
          {transaction.remarks && <Caption>{transaction.remarks}</Caption>}
          <CaptionGrey>
            {format(transaction.createdAt, "dd MMM hh:mm aaa")}
          </CaptionGrey>
          <CaptionGrey>{transaction.addedByUser.name}</CaptionGrey>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row items-end justify-between lg:items-center lg:justify-end">
          <div className="flex gap-2 lg:gap-3 justify-end lg:items-center">
            <H4>{transaction.amount}</H4>
          </div>
          <div className="flex flex-row gap-2 lg:gap-3">
            {isOwner && (
              <TransactionApprovalButton
                txnId={txnId}
                isApproved={transaction.isApproved}
              />
            )}
            {canModifyTransaction && (
              <Link
                href={
                  `/dashboard/bookings/${id}/transactions/modify/${txnId}` as unknown as UrlObject
                }
              >
                <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
                  <div className="hidden lg:flex">
                    <CaptionGrey>{t("Modify")}</CaptionGrey>
                  </div>
                  <LucidePencil className="size-4 lg:size-5 text-slate-500" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      {transaction.transactionPhotoUrl && (
        <div className="flex justify-center items-center overflow-hidden bg-slate-200 rounded-b-lg p-1.5 lg:p-2">
          <Dialog>
            <DialogTrigger className="w-full hover:underline hover:cursor-pointer">
              <CaptionGrey>{t("Proof")}</CaptionGrey>
            </DialogTrigger>
            <DialogContent className="size-10/12">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <Image
                src={fileUrl}
                alt={t("Proof")}
                fill
                className="object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
