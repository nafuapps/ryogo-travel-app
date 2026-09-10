"use client"

import { useTransition } from "react"
import { deleteExpenseAction } from "@/app/actions/expenses/deleteExpenseAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"

export default function DeleteExpenseAlertButton({
  bookingId,
  expenseId,
  agencyId,
  bookingAssignedUserId,
  isRider,
}: {
  bookingId: string
  expenseId: string
  agencyId: string
  bookingAssignedUserId: string
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
        await deleteExpenseAction(
          expenseId,
          agencyId,
          bookingAssignedUserId,
          isRider,
        )
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
      labelChild={<RyogoGhostButton label={t("Label")} type="button" />}
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
