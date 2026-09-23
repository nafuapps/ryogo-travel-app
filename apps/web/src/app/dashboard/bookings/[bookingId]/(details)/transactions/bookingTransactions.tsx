"use client"

import { FindBookingTransactionsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import Link from "next/link"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import TransactionItem from "@/components/flows/bookings/transaction/transactionItem"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import {
  TransactionModesEnum,
  TransactionPartiesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useMemo, useTransition } from "react"
import SelectFilter from "@/components/filter/selectFilter"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { PackageOpen } from "lucide-react"

const TRANSACTIONS_PER_PAGE = 5

export default function BookingTransactionsPageComponent({
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
        <SectionColWrapper className="self-center items-center w-full lg:max-w-3xl">
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
        <SectionColWrapper className="self-center my-auto items-center">
          <RyogoIcon icon={PackageOpen} size="lg" color="light" />
          <RyogoCaption color="light">{t("NoTransactions")}</RyogoCaption>
        </SectionColWrapper>
      )}
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

function TransactionFiltersCard() {
  const t = useTranslations("Dashboard.BookingTransactions")

  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const mode = searchParams.get("mode")
  const party = searchParams.get("party")
  const approved = searchParams.get("approved")

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as Route)
    })
  }

  return (
    <SectionWrapper id="TransactionFiltersCard">
      <div className="grid gap-4 lg:gap-5 grid-cols-2 lg:grid-cols-4 w-full">
        <SelectFilter
          label={t("TypeFilter")}
          enumList={Object.values(TransactionTypesEnum)}
          value={type ?? "All"}
          onValueChange={(value) => updateFilters({ type: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("ModeFilter")}
          enumList={Object.values(TransactionModesEnum)}
          value={mode ?? "All"}
          onValueChange={(value: string) => updateFilters({ mode: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("ApprovalFilter")}
          enumList={["True", "False"]}
          value={approved ?? "All"}
          onValueChange={(value) => updateFilters({ approved: value })}
          disabled={isPending}
        />
        <SelectFilter
          label={t("PartyFilter")}
          enumList={Object.values(TransactionPartiesEnum)}
          value={party ?? "All"}
          onValueChange={(value: string) => updateFilters({ party: value })}
          disabled={isPending}
        />
      </div>
    </SectionWrapper>
  )
}
