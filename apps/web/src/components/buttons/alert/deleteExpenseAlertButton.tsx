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

export default function DeleteExpenseAlertButton(props: {
  bookingId: string
  expenseId: string
  agencyId: string
  assignedUserId: string
  byDriver?: boolean
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
          props.expenseId,
          props.agencyId,
          props.assignedUserId,
          props.byDriver,
        )
      ) {
        toast.success(t("Success"))
        router.replace(`/dashboard/bookings/${props.bookingId}/expenses`)
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
      labelChild={<RyogoGhostButton label={t("Label")} />}
    >
      <RyogoDestructiveButton
        onClick={deleteExpense}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}
