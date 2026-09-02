"use client"

import { useTransition } from "react"
import { deleteTransactionAction } from "@/app/actions/transactions/deleteTransactionAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import {
  RyogoGhostButton,
  RyogoDestructiveButton,
} from "@/components/buttons/ryogoButtons"

export default function DeleteTransactionAlertButton({
  bookingId,
  transactionId,
  agencyId,
  assignedUserId,
}: {
  bookingId: string
  transactionId: string
  agencyId: string
  assignedUserId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.DeleteTransaction")
  const router = useRouter()

  //Delete transaction
  async function deleteTransaction() {
    startTransition(async () => {
      //If delete is successful, show delete success message and redirect to transactions
      if (
        await deleteTransactionAction(transactionId, agencyId, assignedUserId)
      ) {
        toast.success(t("Success"))
        router.replace(`/dashboard/bookings/${bookingId}/transactions`)
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
        onClick={deleteTransaction}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}
