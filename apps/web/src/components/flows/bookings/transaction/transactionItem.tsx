"use client"

import { RyogoCaption, RyogoH3, RyogoTiny } from "@/components/typography"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CreditCard,
  CreditCardMinus,
  CreditCardPlus,
  MessageSquareQuote,
} from "lucide-react"
import { format } from "date-fns"
import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { TransactionApprovalButton } from "./transactionApprovalButton"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { useState } from "react"
import RyogoTag from "@/components/tags/ryogoTag"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"

export default function TransactionItem({
  transaction,
  canModifyTransaction,
  assignedUserId,
}: {
  transaction: NonNullable<FindBookingTransactionsByIdType>[number]
  canModifyTransaction: boolean
  assignedUserId: string
}) {
  const t = useTranslations("Dashboard.BookingTransactions")
  const [open, setOpen] = useState(false)

  const isCredit = [
    TransactionTypesEnum.RECEIVED_PAYMENT_FROM_CUSTOMER,
    TransactionTypesEnum.CUSTOMER_HANDED_TO_DRIVER,
  ].includes(transaction.type)

  const isDebit = [
    TransactionTypesEnum.SENT_TO_CUSTOMER,
    TransactionTypesEnum.DRIVER_HANDED_TO_CUSTOMER,
  ].includes(transaction.type)

  return (
    <SectionWrapper id={transaction.id}>
      <SectionRowWrapper className="items-center">
        <RyogoEnclosedIcon
          icon={
            isDebit ? CreditCardMinus : isCredit ? CreditCardPlus : CreditCard
          }
          size="md"
          color={isDebit ? "red" : isCredit ? "brand" : "slate"}
          bgColor={isDebit ? "red" : isCredit ? "brand" : "slate"}
        />
        <SectionColWrapper small className="w-full">
          <RyogoCaption
            weight="font-bold"
            color={isDebit ? "red" : isCredit ? "brand" : "slate"}
          >
            {transaction.type}
          </RyogoCaption>
          <RyogoTiny color="light">
            {format(transaction.transactionDate, "dd MMM") +
              " - " +
              transaction.mode}
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
      <SectionColWrapper
        className={`border rounded-md p-3 lg:p-4 ${open ? "" : "hidden"}`}
      >
        <SectionRowWrapper className="items-center justify-between">
          <SectionColWrapper>
            <RyogoTiny color="light">{"#" + transaction.id}</RyogoTiny>
            <RyogoImageIconTag
              url={transaction.addedByUser.photoUrl}
              label={transaction.addedByUser.name}
              subtitle={transaction.addedByUser.userRole}
            />
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
          <RyogoTag label={transaction.remarks} icon={MessageSquareQuote} />
        )}
        {canModifyTransaction && (
          <SectionRowWrapper className="items-center mt-auto">
            <TransactionApprovalButton
              transactionId={transaction.id}
              isApproved={transaction.isApproved}
              assignedUserId={assignedUserId}
              agencyId={transaction.agencyId}
            />
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
    </SectionWrapper>
  )
}
