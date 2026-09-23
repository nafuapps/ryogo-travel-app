"use client"

import {
  RyogoH3,
  RyogoCaption,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { format } from "date-fns"
import { FindBookingExpensesByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import ExpenseIcon from "@/components/icons/expenseIcon"
import { ExpenseApprovalButton } from "./expenseApprovalButton"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MessageSquareQuote,
  User,
} from "lucide-react"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ExpenseItem({
  expense,
  canEditExpense,
  isRider,
}: {
  expense: NonNullable<FindBookingExpensesByIdType>[number]
  canEditExpense: boolean
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.BookingExpenses")
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <SectionWrapper id={expense.id}>
      <SectionRowWrapper className="items-center">
        <ExpenseIcon type={expense.type} size="md" />
        <SectionColWrapper small className="w-full">
          <RyogoSmall color="slate" weight="font-bold">
            {expense.type}
          </RyogoSmall>
          <RyogoTiny color="light">
            {format(expense.createdAt, "dd MMM - hh:mm aaa")}
          </RyogoTiny>
        </SectionColWrapper>
        <RyogoH3 color={expense.isApproved ? "green" : "slate"}>
          {expense.amount}
        </RyogoH3>
        <RyogoIcon
          onClick={() => setOpen(!open)}
          size="sm"
          icon={open ? ChevronUp : ChevronDown}
          color="light"
          thick
        />
      </SectionRowWrapper>
      {open && (
        <SectionColWrapper className="border rounded-md p-3 lg:p-4">
          <SectionRowWrapper className="items-center justify-between">
            <SectionColWrapper>
              <RyogoTiny color="light">{"#" + expense.id}</RyogoTiny>
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
                <SectionColWrapper small>
                  <RyogoCaption color="slate">
                    {expense.addedByUser.name}
                  </RyogoCaption>
                  <RyogoTiny color="light">
                    {expense.addedByUser.userRole}
                  </RyogoTiny>
                </SectionColWrapper>
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
          {expense.remarks && (
            <SectionRowWrapper
              small
              className="items-center rounded bg-slate-100 dark:bg-slate-800 px-2 lg:px-3 py-1 lg:py-1.5"
            >
              <RyogoIcon size="xs" icon={MessageSquareQuote} color="light" />
              <RyogoTiny color="light">{expense.remarks}</RyogoTiny>
            </SectionRowWrapper>
          )}
          <SectionRowWrapper className="items-center mt-auto">
            <ExpenseApprovalButton
              expId={expense.id}
              isApproved={expense.isApproved}
              agencyId={expense.agencyId}
              isRider={isRider}
            />
            {canEditExpense && (
              <RyogoOutlineButton
                label={t("Modify")}
                className="grow"
                onClick={() =>
                  router.push(
                    isRider
                      ? `/rider/myBookings/${expense.bookingId}/expenses/modify/${expense.id}`
                      : `/dashboard/bookings/${expense.bookingId}/expenses/modify/${expense.id}`,
                  )
                }
                disabled={isRider && expense.isApproved}
              >
                <RyogoIcon icon={ChevronRight} size="xs" color="slate" />
              </RyogoOutlineButton>
            )}
          </SectionRowWrapper>
        </SectionColWrapper>
      )}
    </SectionWrapper>
  )
}
