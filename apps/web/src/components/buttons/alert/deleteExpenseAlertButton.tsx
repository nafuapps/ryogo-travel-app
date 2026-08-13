"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { deleteExpenseAction } from "@/app/actions/expenses/deleteExpenseAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { RyogoCaption } from "@/components/typography"

type DeleteExpenseAlertButtonProps = {
  bookingId: string
  expenseId: string
  agencyId: string
  assignedUserId: string
  byDriver?: boolean
}
export default function DeleteExpenseAlertButton(
  props: DeleteExpenseAlertButtonProps,
) {
  const [isCancelPending, startCancelTransition] = useTransition()
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
      labelChild={
        <Button variant={"ghost"}>
          <RyogoCaption color="light">{t("Label")}</RyogoCaption>
        </Button>
      }
    >
      <Button
        variant={"destructive"}
        onClick={deleteExpense}
        disabled={isCancelPending}
      >
        {isCancelPending && <Spinner />}
        <RyogoCaption color="white">
          {isCancelPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}
