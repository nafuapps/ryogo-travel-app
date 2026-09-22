import {
  RyogoCaption,
  RyogoH3,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  ChevronRight,
  CreditCardMinus,
  CreditCardPlus,
  MessageSquareQuote,
  User,
} from "lucide-react"
import { format } from "date-fns"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { TransactionApprovalButton } from "./transactionApprovalButton"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"

export default async function TransactionItem({
  transaction,
  canModifyTransaction,
  isOwner,
}: {
  transaction: NonNullable<FindBookingTransactionsByIdType>[number]
  canModifyTransaction: boolean
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.BookingTransactions")

  const isDebit = transaction.type === TransactionTypesEnum.DEBIT

  return (
    <SectionColWrapper className="h-full p-4 lg:p-5 border rounded-md">
      <SectionRowWrapper className="justify-between item-center">
        <RyogoTiny color="light">{transaction.id}</RyogoTiny>
        <RyogoTiny color="light">
          {format(transaction.createdAt, "dd MMM - hh:mm aaa")}
        </RyogoTiny>
      </SectionRowWrapper>
      <SectionRowWrapper className="justify-between items-center">
        <SectionRowWrapper className="items-center">
          <RyogoEnclosedIcon
            icon={isDebit ? CreditCardMinus : CreditCardPlus}
            size="sm"
            color={"slate"}
            bgColor={"slate"}
          />
          <SectionColWrapper small>
            <RyogoCaption weight="font-bold">{transaction.mode}</RyogoCaption>
            <RyogoCaption color={"light"}>
              {(isDebit ? t("To") : t("From")) + transaction.otherParty}
            </RyogoCaption>
          </SectionColWrapper>
        </SectionRowWrapper>
        <RyogoH3 color={isDebit ? "slate" : "green"}>
          {transaction.amount}
        </RyogoH3>
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <SectionColWrapper>
          {transaction.remarks && (
            <SectionRowWrapper
              small
              className="items-center rounded bg-slate-100 dark:bg-slate-800 px-2 lg:px-3 py-1 lg:py-1.5"
            >
              <RyogoIcon size="xs" icon={MessageSquareQuote} color="light" />
              <RyogoTiny color="light">{transaction.remarks}</RyogoTiny>
            </SectionRowWrapper>
          )}
          <SectionRowWrapper className="items-center">
            {transaction.addedByUser.photoUrl ? (
              <RyogoImage
                src={getFileUrl(transaction.addedByUser.photoUrl)}
                alt={transaction.addedByUser.name}
                imageSize="xs"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="sm" />
            )}
            <RyogoCaption color="light">
              {transaction.addedByUser.name}
            </RyogoCaption>
          </SectionRowWrapper>
        </SectionColWrapper>
        {transaction.transactionPhotoUrl && (
          <RyogoDialogImage
            src={getFileUrl(transaction.transactionPhotoUrl)}
            alt={
              transaction.type +
              " " +
              transaction.amount +
              " " +
              transaction.mode
            }
            imageSize="md"
          />
        )}
      </SectionRowWrapper>
      {canModifyTransaction && (
        <SectionRowWrapper className="items-center mt-auto">
          {isOwner && (
            <TransactionApprovalButton
              txnId={transaction.id}
              isApproved={transaction.isApproved}
              agencyId={transaction.agencyId}
            />
          )}
          <Link
            href={`/dashboard/bookings/${transaction.bookingId}/transactions/modify/${transaction.id}`}
            className="grow"
          >
            <RyogoOutlineButton label={t("Modify")} className="w-full">
              <RyogoIcon icon={ChevronRight} size="xs" color="slate" />
            </RyogoOutlineButton>
          </Link>
        </SectionRowWrapper>
      )}
    </SectionColWrapper>
  )
}
