import { CaptionGrey, H4, Caption, SmallBold } from "@/components/typography"
import {
  LucideChevronRight,
  LucideFuel,
  LucideParkingSquare,
  LucideWrench,
  LucideAirVent,
  LucidePizza,
  LucideTicket,
  LucideBanknote,
} from "lucide-react"
import { format } from "date-fns"
import { UrlObject } from "url"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"

export default async function ExpenseItem({
  expense,
  canModifyExpense,
}: {
  expense: NonNullable<FindBookingExpensesByIdType>[0]
  canModifyExpense: boolean
}) {
  const t = await getTranslations("Dashboard.BookingExpenses")
  const id = expense.bookingId
  const expId = expense.id
  let fileUrl = ""
  if (expense.expensePhotoUrl) {
    fileUrl = getFileUrl(expense.expensePhotoUrl)
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row ${
          expense.expensePhotoUrl ? "rounded-t-lg" : "rounded-lg"
        } justify-between gap-3 lg:gap-4 items-center w-full bg-white p-3 lg:p-4 overflow-hidden lg:flex-row lg:items-center`}
      >
        <div className="flex flex-col gap-1.5 lg:gap-2 justify-start min-w-1/5">
          <div className="flex size-7 lg:size-8 bg-slate-100 rounded-full items-center justify-center">
            {getExpenseIcon(expense.type)}
          </div>
          <CaptionGrey>{expense.id}</CaptionGrey>
        </div>
        <div className="flex flex-col gap-2 lg:gap-3 w-full">
          <SmallBold>{expense.type.toUpperCase()}</SmallBold>
          {expense.remarks && <Caption>{expense.remarks}</Caption>}
          <CaptionGrey>
            {format(expense.createdAt, "dd MMM hh:mm aaa")}
          </CaptionGrey>
          <CaptionGrey>
            {expense.addedByUser.name} (
            {expense.addedByUser.userRole.toUpperCase()})
          </CaptionGrey>
        </div>
        <div className="flexgap-2 lg:gap-3 justify-end lg:items-center">
          <H4>{expense.amount}</H4>
        </div>
        {canModifyExpense && (
          <Link
            href={
              `/dashboard/bookings/${id}/expenses/modify/${expId}` as unknown as UrlObject
            }
          >
            <div className="flex p-2 lg:pl-3 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
              <div className="hidden lg:flex">
                <CaptionGrey>{t("Modify")}</CaptionGrey>
              </div>
              <LucideChevronRight className="size-5 lg:size-6 text-slate-500" />
            </div>
          </Link>
        )}
      </div>
      {expense.expensePhotoUrl && (
        <div className="flex justify-center items-center overflow-hidden bg-slate-200 rounded-b-lg p-1.5 lg:p-2">
          <Dialog>
            <DialogTrigger className="w-full hover:underline hover:cursor-pointer">
              <CaptionGrey>{t("Proof")}</CaptionGrey>
            </DialogTrigger>
            <DialogContent className="size-10/12">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <Image
                src={fileUrl}
                alt={t("Proof")}
                fill
                className="object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

const getExpenseIcon = (type: ExpenseTypesEnum) => {
  const className = "size-4 lg:size-5 text-slate-500"
  switch (type) {
    case ExpenseTypesEnum.FOOD:
      return <LucidePizza className={className} />
    case ExpenseTypesEnum.FUEL:
      return <LucideFuel className={className} />
    case ExpenseTypesEnum.PARKING:
      return <LucideParkingSquare className={className} />
    case ExpenseTypesEnum.MAINTENANCE:
      return <LucideWrench className={className} />
    case ExpenseTypesEnum.AC:
      return <LucideAirVent className={className} />
    case ExpenseTypesEnum.TOLL:
      return <LucideTicket className={className} />
    case ExpenseTypesEnum.OTHER:
      return <LucideBanknote className={className} />
    default:
      return <LucideBanknote className={className} />
  }
}
