"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { changeTransactionApprovalAction } from "@/app/actions/transactions/changeTransactionApprovalAction"
import { useTransition } from "react"
import RyogoApprovalTooltip from "@/components/buttons/tooltip/ryogoApprovalTooltip"

export function TransactionApprovalButton({
  txnId,
  isApproved,
  agencyId,
}: {
  txnId: string
  isApproved: boolean
  agencyId: string
}) {
  const t = useTranslations("Dashboard.BookingTransactions")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function approveTransaction() {
    startTransition(async () => {
      if (await changeTransactionApprovalAction(txnId, true, agencyId)) {
        toast.success(t("ApproveSuccess"))
      } else {
        toast.success(t("ApproveError"))
      }
      router.refresh()
    })
  }

  async function rejectTransaction() {
    if (await changeTransactionApprovalAction(txnId, false, agencyId)) {
      toast.info(t("RejectSuccess"))
    } else {
      toast.success(t("RejectError"))
    }
    router.refresh()
  }

  return (
    <RyogoApprovalTooltip
      label={isApproved ? t("Approved") : t("Approve")}
      tooltipText={isApproved ? t("RejectTitle") : t("RejectTitle")}
      isApproved={isApproved}
      onClick={isApproved ? rejectTransaction : approveTransaction}
      disabled={isPending}
    />
  )
}
