import {
  RyogoH3,
  RyogoCaption,
  RyogoP,
  RyogoTiny,
} from "@/components/typography"
import { format } from "date-fns"
import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import ExpenseIcon from "@/components/icons/expenseIcon"
import { ExpenseApprovalButton } from "./expenseApprovalButton"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { ChevronRight, MessageSquareQuote, User } from "lucide-react"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"

export default async function ExpenseItem({
  expense,
  canEditExpense,
  isRider,
}: {
  expense: NonNullable<FindBookingExpensesByIdType>[number]
  canEditExpense: boolean
  isRider?: boolean
}) {
  const t = await getTranslations("Dashboard.BookingExpenses")

  return (
    <SectionColWrapper className="h-full p-4 lg:p-5 border rounded-md">
      <SectionRowWrapper className="justify-between item-center">
        <RyogoTiny color="light">{expense.id}</RyogoTiny>
        <RyogoTiny color="light">
          {format(expense.createdAt, "dd MMM - hh:mm aaa")}
        </RyogoTiny>
      </SectionRowWrapper>
      <SectionRowWrapper className="justify-between items-center">
        <SectionRowWrapper className="items-center">
          <ExpenseIcon type={expense.type} />
          <RyogoP color="slate" weight="font-bold">
            {expense.type}
          </RyogoP>
        </SectionRowWrapper>
        <RyogoH3>{expense.amount}</RyogoH3>
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-between">
        <SectionColWrapper>
          {expense.remarks && (
            <SectionRowWrapper
              small
              className="items-center rounded bg-slate-100 dark:bg-slate-800 px-2 lg:px-3 py-1 lg:py-1.5"
            >
              <RyogoIcon size="xs" icon={MessageSquareQuote} color="light" />
              <RyogoTiny color="light">{expense.remarks}</RyogoTiny>
            </SectionRowWrapper>
          )}
          <SectionRowWrapper className="items-center">
            {expense.addedByUser.photoUrl ? (
              <RyogoImage
                src={getFileUrl(expense.addedByUser.photoUrl)}
                alt={expense.addedByUser.name}
                imageSize="xs"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="sm" />
            )}
            <RyogoCaption color="light">
              {expense.addedByUser.name}
            </RyogoCaption>
          </SectionRowWrapper>
        </SectionColWrapper>
        {expense.expensePhotoUrl && (
          <RyogoDialogImage
            src={getFileUrl(expense.expensePhotoUrl)}
            alt={expense.type + " " + expense.amount}
            imageSize="md"
          />
        )}
      </SectionRowWrapper>
      {canEditExpense && (
        <SectionRowWrapper className="items-center mt-auto">
          {!isRider && (
            <ExpenseApprovalButton
              expId={expense.id}
              isApproved={expense.isApproved}
              agencyId={expense.agencyId}
            />
          )}
          <Link
            href={`/dashboard/bookings/${expense.bookingId}/expenses/modify/${expense.id}`}
            className="grow"
          >
            <RyogoOutlineButton label={t("Modify")} className="w-full">
              <RyogoIcon icon={ChevronRight} size="xs" color="slate" />
            </RyogoOutlineButton>
          </Link>
        </SectionRowWrapper>
      )}
    </SectionColWrapper>
  )
}
