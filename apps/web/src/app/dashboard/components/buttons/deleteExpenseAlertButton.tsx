"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { deleteExpenseAction } from "../actions/deleteExpenseAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"

type DeleteExpenseAlertButtonProps = {
  bookingId: string
  expenseId: string
}
export default function DeleteExpenseAlertButton(
  props: DeleteExpenseAlertButtonProps
) {
  const [isCancelPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteExpense")

  const router = useRouter()

  //Delete expense
  async function deleteExpense() {
    startCancelTransition(async () => {
      //If delete is successful, show delete success message and redirect to expenses
      if (await deleteExpenseAction(props.expenseId)) {
        toast.success(t("Success"))
        router.replace(`/dashboard/bookings/${props.bookingId}/expenses`)
      } else {
        //If delete is not successful, show error message
        toast.error(t("Error"))
      }
    })
  }

  return (
    <BookingAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={<Button variant={"secondary"}>{t("Label")}</Button>}
    >
      <Button
        variant={"destructive"}
        onClick={deleteExpense}
        disabled={isCancelPending}
      >
        {isCancelPending && <Spinner />}
        {isCancelPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}
