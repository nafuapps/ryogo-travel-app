"use client"

import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import {
  SectionColWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import ExpenseItem from "@/components/flows/bookings/expense/expenseItem"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ExpenseTypesEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { usePagination } from "@/hooks/usePagination"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { BanknoteX } from "lucide-react"
import { Route } from "next"
import ExpensesFiltersCard from "@/components/filter/expensesFiltersCard"

const EXPENSES_PER_PAGE = 5

export default function MyBookingExpensesPageComponent({
  userId,
  bookingId,
  bookingExpenses,
  canAddExpense,
}: {
  userId: string
  bookingId: string
  bookingExpenses: FindBookingExpensesByIdType
  canAddExpense: boolean
}) {
  const t = useTranslations("Rider.MyBookingExpenses")
  const router = useRouter()
  const pathname = usePathname()

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
                isRider
              />
            )
          })}
        </SectionColWrapper>
      ) : (
        <SectionColWrapper className="self-center my-auto items-center">
          <RyogoIcon icon={BanknoteX} size="lg" color="light" />
          <RyogoCaption color="light">{t("NoExpenses")}</RyogoCaption>
        </SectionColWrapper>
      )}
      {canAddExpense && (
        <StickyActionWrapper>
          <Link href={`/rider/myBookings/${bookingId}/expenses/add`}>
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
