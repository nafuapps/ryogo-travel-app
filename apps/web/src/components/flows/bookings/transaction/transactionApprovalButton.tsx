"use client"

import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { changeTransactionApprovalAction } from "@/app/actions/transactions/changeTransactionApprovalAction"
import { useTransition } from "react"
import { Check, CheckCheck } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

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

  if (isApproved) {
    return (
      <RyogoGhostButton
        label={t("Approved")}
        labelColor={"green"}
        onClick={rejectTransaction}
        disabled={isPending}
        className="grow border"
      >
        <RyogoIcon icon={CheckCheck} size="xs" color={"green"} thick />
      </RyogoGhostButton>
    )
  }

  return (
    <RyogoOutlineButton
      label={t("Approve")}
      labelColor={"slate"}
      onClick={approveTransaction}
      disabled={isPending}
      className="grow"
    >
      <RyogoIcon icon={Check} size="xs" color={"slate"} thick />
    </RyogoOutlineButton>
  )
}
