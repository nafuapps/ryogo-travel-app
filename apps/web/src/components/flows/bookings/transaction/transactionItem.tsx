"use client"

import { RyogoCaption, RyogoH3, RyogoTiny } from "@/components/typography"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCardMinus,
  CreditCardPlus,
  MessageSquareQuote,
  User,
} from "lucide-react"
import { format } from "date-fns"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { TransactionApprovalButton } from "./transactionApprovalButton"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { useState } from "react"

export default function TransactionItem({
  transaction,
  canModifyTransaction,
  isOwner,
}: {
  transaction: NonNullable<FindBookingTransactionsByIdType>[number]
  canModifyTransaction: boolean
  isOwner: boolean
}) {
  const t = useTranslations("Dashboard.BookingTransactions")
  const [open, setOpen] = useState(false)

  const isDebit = transaction.type === TransactionTypesEnum.DEBIT

  return (
    <SectionWrapper id={transaction.id}>
      <SectionRowWrapper className="items-center">
        <RyogoEnclosedIcon
          icon={isDebit ? CreditCardMinus : CreditCardPlus}
          size="md"
          color={isDebit ? "slate" : "brand"}
        />
        <SectionColWrapper small className="w-full">
          <RyogoCaption weight="font-bold" color={isDebit ? "slate" : "brand"}>
            {transaction.mode +
              (isDebit ? t("To") : t("From")) +
              transaction.otherParty}
          </RyogoCaption>
          <RyogoTiny color="light">
            {format(transaction.createdAt, "dd MMM - hh:mm aaa")}
          </RyogoTiny>
        </SectionColWrapper>
        <RyogoH3 color={transaction.isApproved ? "green" : "slate"}>
          {transaction.amount}
        </RyogoH3>
        <RyogoIcon
          onClick={() => setOpen(!open)}
          size="sm"
          icon={open ? ChevronUp : ChevronDown}
          color="light"
          thick
        />
      </SectionRowWrapper>
      {open && (
        <SectionColWrapper className="border rounded-md p-3 lg:p-4">
          <SectionRowWrapper className="items-center justify-between">
            <SectionColWrapper>
              <RyogoTiny color="light">{"#" + transaction.id}</RyogoTiny>
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
                <SectionColWrapper small>
                  <RyogoCaption color="slate">
                    {transaction.addedByUser.name}
                  </RyogoCaption>
                  <RyogoTiny color="light">
                    {transaction.addedByUser.userRole}
                  </RyogoTiny>
                </SectionColWrapper>
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
          {transaction.remarks && (
            <SectionRowWrapper
              small
              className="items-center rounded bg-slate-100 dark:bg-slate-800 px-2 lg:px-3 py-1 lg:py-1.5"
            >
              <RyogoIcon size="xs" icon={MessageSquareQuote} color="light" />
              <RyogoTiny color="light">{transaction.remarks}</RyogoTiny>
            </SectionRowWrapper>
          )}
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
      )}
    </SectionWrapper>
  )
}
