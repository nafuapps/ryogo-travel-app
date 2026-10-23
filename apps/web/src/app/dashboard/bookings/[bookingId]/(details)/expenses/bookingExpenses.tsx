"use client"

import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import ExpensesFiltersCard from "@/components/filter/expensesFiltersCard"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { usePagination } from "@/hooks/usePagination"
import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { BanknoteX } from "lucide-react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

const EXPENSES_PER_PAGE = 5

export default function BookingExpensesPageComponent({
  bookingExpenses,
  canEditExpense,
  assignedUserId,
}: {
  bookingExpenses: FindBookingExpensesByIdType
  canEditExpense: boolean
  assignedUserId: string
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
  const paidByDriver = searchParams.get("paidByDriver")
  const approved = searchParams.get("approved")

  const filteredExpenses = bookingExpenses.filter((expense) => {
    return (
      (!type || expense.type === (type as ExpenseTypesEnum)) &&
      (paidByDriver === null ||
        expense.isPaidByDriver === (paidByDriver === "True")) &&
      (approved === null || expense.isApproved === (approved === "True"))
    )
  })

  //Pagination of expenses
  const { currentItems, currentPage, totalPages, handlePageChange } =
    usePagination(filteredExpenses, EXPENSES_PER_PAGE)

  return (
    <>
      {bookingExpenses.length > 0 ? (
        <SectionColWrapper className="self-center items-center w-full">
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
                assignedUserId={assignedUserId}
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
        <EmptyStateIcon icon={BanknoteX} label={t("NoExpenses")} />
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
