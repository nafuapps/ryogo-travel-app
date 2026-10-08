"use client"

import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import TransactionItem from "@/components/flows/bookings/transaction/transactionItem"
import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import {
  TransactionModesEnum,
  TransactionPartiesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { PackageOpen } from "lucide-react"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import TransactionFiltersCard from "@/components/filter/transactionsFilterCard"

const TRANSACTIONS_PER_PAGE = 5

export default function BookingTransactionsPageComponent({
  bookingTransactions,
  canCreateTransaction,
  isOwner,
}: {
  bookingTransactions: FindBookingTransactionsByIdType
  canCreateTransaction: boolean
  isOwner: boolean
}) {
  const t = useTranslations("Dashboard.BookingTransactions")
  const router = useRouter()
  const pathname = usePathname()

  //Calculate total amount
  const totalTransactionsAmount = useMemo(
    () => addTransactionAmounts(bookingTransactions),
    [bookingTransactions],
  )

  const approvedTransactions = useMemo(
    () => filterApprovedTransactions(bookingTransactions),
    [bookingTransactions],
  )

  //Calculate approved amount
  const approvedTransactionsAmount = useMemo(
    () => addTransactionAmounts(approvedTransactions),
    [approvedTransactions],
  )

  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const mode = searchParams.get("mode")
  const party = searchParams.get("party")
  const approved = searchParams.get("approved")

  const filteredTransactions = bookingTransactions.filter((txn) => {
    return (
      (!type || txn.type === (type as TransactionTypesEnum)) &&
      (!mode || txn.mode === (mode as TransactionModesEnum)) &&
      (!party || txn.otherParty === (party as TransactionPartiesEnum)) &&
      (approved === null || txn.isApproved === (approved === "True"))
    )
  })

  //Pagination of txns
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredTransactions, TRANSACTIONS_PER_PAGE)

  return (
    <>
      {bookingTransactions.length > 0 ? (
        <SectionColWrapper className="self-center items-center w-full">
          <SectionWrapper id="TransactionsAmountCard">
            <SectionRowWrapper className="items-center divide-x justify-between">
              <SectionColWrapper small className="w-full items-center">
                <RyogoCaption color="light">
                  {t("TotalTxnAmount") +
                    " (" +
                    bookingTransactions.length +
                    ")"}
                </RyogoCaption>
                <RyogoH3>{"₹" + totalTransactionsAmount}</RyogoH3>
              </SectionColWrapper>
              <SectionColWrapper small className="w-full items-center">
                <RyogoCaption color="light">
                  {t("ApprovedTxnAmount") +
                    " (" +
                    approvedTransactions.length +
                    ")"}
                </RyogoCaption>
                <RyogoH3 color="green">
                  {"₹" + approvedTransactionsAmount}
                </RyogoH3>
              </SectionColWrapper>
            </SectionRowWrapper>
          </SectionWrapper>
          <TransactionFiltersCard />
          <SectionRowWrapper className="w-full items-center justify-between">
            <RyogoCaption color="light">
              {t("FilteredTransactions") +
                " (" +
                filteredTransactions.length +
                ")"}
            </RyogoCaption>
            <RyogoGhostButton
              label={t("ClearFilters")}
              labelColor="light"
              onClick={() => router.push(pathname as Route)}
              disabled={searchParams.size === 0}
            />
          </SectionRowWrapper>
          {currentItems.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              canModifyTransaction={canCreateTransaction}
              isOwner={isOwner}
            />
          ))}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </SectionColWrapper>
      ) : (
        <EmptyStateIcon icon={PackageOpen} label={t("NoTransactions")} />
      )}
    </>
  )
}

function addTransactionAmounts(txns: FindBookingTransactionsByIdType) {
  return txns.reduce((total, txn) => {
    return total + txn.amount
  }, 0)
}

function filterApprovedTransactions(txns: FindBookingTransactionsByIdType) {
  return txns.filter((txn) => txn.isApproved)
}
