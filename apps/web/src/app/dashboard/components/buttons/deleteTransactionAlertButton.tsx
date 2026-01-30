"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { deleteTransactionAction } from "@/app/actions/deleteTransactionAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"

type DeleteTransactionAlertButtonProps = {
  bookingId: string
  transactionId: string
}
export default function DeleteTransactionAlertButton(
  props: DeleteTransactionAlertButtonProps,
) {
  const [isCancelPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteTransaction")
  const router = useRouter()

  //Delete transaction
  async function deleteTransaction() {
    startCancelTransition(async () => {
      //If delete is successful, show delete success message and redirect to transactions
      if (await deleteTransactionAction(props.transactionId)) {
        toast.success(t("Success"))
        router.replace(`/dashboard/bookings/${props.bookingId}/transactions`)
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
        onClick={deleteTransaction}
        disabled={isCancelPending}
      >
        {isCancelPending && <Spinner />}
        {isCancelPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}
