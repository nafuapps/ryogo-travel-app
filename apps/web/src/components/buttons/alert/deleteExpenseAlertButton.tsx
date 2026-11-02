"use client"

import { deleteExpenseAction } from "@/app/actions/expenses/deleteExpenseAction"
import {
  RyogoDestructiveButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import RyogoAlertDialog from "./ryogoAlertDialog"

export default function DeleteExpenseAlertButton({
  bookingId,
  expenseId,
  agencyId,
  addedByUserId,
  bookingAssignedUserId,
  disabled,
  isRider,
}: {
  bookingId: string
  expenseId: string
  agencyId: string
  addedByUserId: string
  bookingAssignedUserId: string
  disabled: boolean
  isRider?: boolean
}) {
  const [isPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteExpense")

  const router = useRouter()

  //Delete expense
  async function deleteExpense() {
    startCancelTransition(async () => {
      //If delete is successful, show delete success message and redirect to expenses
      if (
        await deleteExpenseAction({
          expenseId,
          agencyId,
          assignedUserId: addedByUserId,
          bookingAssignedUserId,
          isRider,
        })
      ) {
        toast.success(t("Success"))
        router.replace(
          isRider
            ? `/rider/myBookings/${bookingId}/expenses`
            : `/dashboard/bookings/${bookingId}/expenses`,
        )
      } else {
        //If delete is not successful, show error message
        toast.error(t("Error"))
      }
    })
  }

  return (
    <RyogoAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={
        <RyogoGhostButton
          label={t("Label")}
          labelColor="light"
          type="button"
          disabled={disabled}
        />
      }
    >
      <RyogoDestructiveButton
        onClick={deleteExpense}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
        type="button"
      />
    </RyogoAlertDialog>
  )
}
