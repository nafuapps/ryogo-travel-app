"use client"

import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { Route } from "next"
import { ExpenseTypesEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { usePagination } from "@/hooks/usePagination"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { BanknoteX } from "lucide-react"
import ExpensesFiltersCard from "@/components/filter/expensesFiltersCard"

const EXPENSES_PER_PAGE = 5

export default function BookingExpensesPageComponent({
  bookingId,
  bookingExpenses,
  canEditExpense,
}: {
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
  canEditExpense: boolean
}) {
  const t = useTranslations("Dashboard.BookingExpenses")
  const router = useRouter()
  const pathname = usePathname()

  //Calculate total amount
  const totalExpensesAmount = useMemo(
    () => addExpenseAmounts(bookingExpenses),
    [bookingExpenses],
  )

  const approvedExpenses = useMemo(
    () => filterApprovedExpenses(bookingExpenses),
    [bookingExpenses],
  )

  //Calculate approved amount
  const approvedExpensesAmount = useMemo(
    () => addExpenseAmounts(approvedExpenses),
    [approvedExpenses],
  )

  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const role = searchParams.get("role")
  // const party = searchParams.get("party")
  const approved = searchParams.get("approved")

  const filteredExpenses = bookingExpenses.filter((expense) => {
    return (
      (!type || expense.type === (type as ExpenseTypesEnum)) &&
      (!role || expense.addedByUser.userRole === (role as UserRolesEnum)) &&
      // (!party || expense.otherParty === (party as TransactionPartiesEnum)) &&
      (approved === null || expense.isApproved === (approved === "True"))
    )
  })

  //Pagination of expenses
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredExpenses, EXPENSES_PER_PAGE)

  return (
    <>
      {bookingExpenses.length > 0 ? (
        <SectionColWrapper className="self-center items-center w-full lg:max-w-3xl">
          <SectionWrapper id="ExpensesAmountCard">
            <SectionRowWrapper className="items-center divide-x justify-between">
              <SectionColWrapper small className="w-full items-center">
                <RyogoCaption color="light">
                  {t("TotalAmount") + " (" + bookingExpenses.length + ")"}
                </RyogoCaption>
                <RyogoH3>{"₹" + totalExpensesAmount}</RyogoH3>
              </SectionColWrapper>
              <SectionColWrapper small className="w-full items-center">
                <RyogoCaption color="light">
                  {t("ApprovedAmount") + " (" + approvedExpenses.length + ")"}
                </RyogoCaption>
                <RyogoH3 color="green">{"₹" + approvedExpensesAmount}</RyogoH3>
              </SectionColWrapper>
            </SectionRowWrapper>
          </SectionWrapper>
          <ExpensesFiltersCard />
          <SectionRowWrapper className="w-full items-center justify-between">
            <RyogoCaption color="light">
              {t("FilteredExpenses") + " (" + filteredExpenses.length + ")"}
            </RyogoCaption>
            <RyogoGhostButton
              label={t("ClearFilters")}
              labelColor="light"
              onClick={() => router.push(pathname as Route)}
              disabled={searchParams.size === 0}
            />
          </SectionRowWrapper>
          {currentItems.map((expense) => {
            return (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                canEditExpense={canEditExpense}
              />
            )
          })}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </SectionColWrapper>
      ) : (
        <SectionColWrapper className="self-center my-auto items-center">
          <RyogoIcon icon={BanknoteX} size="lg" color="light" />
          <RyogoCaption color="light">{t("NoExpenses")}</RyogoCaption>
        </SectionColWrapper>
      )}
      {canEditExpense && (
        <StickyActionWrapper>
          <Link href={`/dashboard/bookings/${bookingId}/expenses/new`}>
            <RyogoDefaultButton
              label={t("AddExpense")}
              size={"lg"}
              className="w-full"
            />
          </Link>
        </StickyActionWrapper>
      )}
    </>
  )
}

function addExpenseAmounts(expenses: FindBookingExpensesByIdType) {
  return expenses.reduce((total, expense) => {
    return total + expense.amount
  }, 0)
}

function filterApprovedExpenses(expenses: FindBookingExpensesByIdType) {
  return expenses.filter((expense) => expense.isApproved)
}
