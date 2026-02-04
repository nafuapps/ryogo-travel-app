import { CaptionGrey, SmallBold, H4, Caption } from "@/components/typography"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getCurrentUser } from "@/lib/auth"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { ExpenseTypesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  LucidePencil,
  LucidePizza,
  LucideFuel,
  LucideParkingSquare,
  LucideWrench,
  LucideAirVent,
  LucideTicket,
  LucideBanknote,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { format } from "date-fns"
import { UrlObject } from "url"
import Image from "next/image"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"

export default async function RiderExpenseItem({
  expense,
  bookingId,
}: {
  expense: NonNullable<FindBookingDetailsByIdType>["expenses"][number]
  bookingId: string
}) {
  const t = await getTranslations("Rider.MyBooking.Expense")
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  let fileUrl = ""
  if (expense.expensePhotoUrl) {
    fileUrl = getFileUrl(expense.expensePhotoUrl)
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex flex-row border border-slate-100 ${
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
        <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row items-end justify-between lg:items-center lg:justify-end">
          <div className="flexgap-2 lg:gap-3 justify-end lg:items-center">
            <H4>{expense.amount}</H4>
          </div>
          <div className="flex flex-row gap-2 lg:gap-3">
            {expense.addedByUser.id === currentUser.userId && (
              <Link
                href={
                  `/rider/myBookings/${bookingId}/modify-expense/${expense.id}` as unknown as UrlObject
                }
              >
                <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition">
                  <div className="hidden lg:flex">
                    <CaptionGrey>{t("Modify")}</CaptionGrey>
                  </div>
                  <LucidePencil className="size-4 lg:size-5 text-slate-500" />
                </div>
              </Link>
            )}
          </div>
        </div>
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
