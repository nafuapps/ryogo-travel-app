"use client"

import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import ExpensesFiltersCard from "@/components/filter/expensesFiltersCard"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { PaginationControls } from "@/components/pagination/paginationControls"
import { RyogoCaption } from "@/components/typography"
import { usePagination } from "@/hooks/usePagination"
import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { BanknoteX } from "lucide-react"
import { Route } from "next"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const EXPENSES_PER_PAGE = 5

export default function MyBookingExpensesPageComponent({
  userId,
  bookingExpenses,
  assignedUserId,
}: {
  userId: string
  bookingExpenses: FindBookingExpensesByIdType
  assignedUserId: string
}) {
  const t = useTranslations("Rider.MyBookingExpenses")
  const router = useRouter()
  const pathname = usePathname()

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
                canEditExpense={userId === expense.addedByUserId}
                assignedUserId={assignedUserId}
                isRider
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
