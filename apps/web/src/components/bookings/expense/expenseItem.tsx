import { RyogoH3, RyogoCaption, RyogoSmall } from "@/components/typography"
import { Pencil } from "lucide-react"
import { format } from "date-fns"
import { UrlObject } from "url"
import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import getExpenseIcon from "@/components/icons/expenseIcon"
import { ExpenseApprovalButton } from "./expenseApprovalButton"
import { RyogoChinImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function ExpenseItem({
  expense,
  canModifyExpense,
  canApproveExpense,
}: {
  expense: NonNullable<FindBookingExpensesByIdType>[0]
  canModifyExpense: boolean
  canApproveExpense: boolean
}) {
  const t = await getTranslations("Dashboard.BookingExpenses")
  const id = expense.bookingId

  const expId = expense.id

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${
          expense.expensePhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <div className="flex flex-col gap-1.5 lg:gap-2 min-w-1/5">
          <div className="flex size-7 lg:size-8 bg-slate-100 rounded-full items-center justify-center">
            {getExpenseIcon(expense.type)}
          </div>
          <RyogoCaption color="light">{expense.id}</RyogoCaption>
        </div>
        <div className="flex flex-col gap-2 lg:gap-3 w-full">
          <RyogoSmall weight="font-bold">
            {expense.type.toUpperCase()}
          </RyogoSmall>
          {expense.remarks && (
            <RyogoCaption color="slate">{expense.remarks}</RyogoCaption>
          )}
          <RyogoCaption color="light">
            {format(expense.createdAt, "dd MMM hh:mm aaa")}
          </RyogoCaption>
          <RyogoCaption color="light">{expense.addedByUser.name}</RyogoCaption>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row items-end justify-between lg:items-center lg:justify-end">
          <div className="flexgap-2 lg:gap-3 justify-end lg:items-center">
            <RyogoH3>{expense.amount}</RyogoH3>
          </div>
          <div className="flex flex-row gap-2 lg:gap-3">
            {canApproveExpense && (
              <ExpenseApprovalButton
                expId={expId}
                isApproved={expense.isApproved}
                agencyId={expense.agencyId}
              />
            )}
            {canModifyExpense && (
              <Link
                href={
                  `/dashboard/bookings/${id}/expenses/modify/${expId}` as unknown as UrlObject
                }
              >
                <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
                  <div className="hidden lg:flex">
                    <RyogoCaption color="light">{t("Modify")}</RyogoCaption>
                  </div>
                  <RyogoIcon icon={Pencil} size="sm" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      {expense.expensePhotoUrl && (
        <RyogoChinImage
          src={getFileUrl(expense.expensePhotoUrl)}
          alt={t("Proof")}
        />
      )}
    </div>
  )
}
