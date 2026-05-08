"use client"

import { useTranslations } from "next-intl"
import { changeExpenseApprovalAction } from "@/app/actions/expenses/changeExpenseApprovalAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import RyogoApprovalTooltip from "@/components/buttons/tooltip/ryogoApprovalTooltip"

export function ExpenseApprovalButton({
  expId,
  isApproved,
  agencyId,
}: {
  expId: string
  isApproved: boolean
  agencyId: string
}) {
  const t = useTranslations("Dashboard.BookingExpenses")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function approveExpense() {
    startTransition(async () => {
      if (await changeExpenseApprovalAction(expId, true, agencyId)) {
        toast.success(t("ApproveSuccess"))
      } else {
        toast.success(t("ApproveError"))
      }
      router.refresh()
    })
  }

  async function rejectExpense() {
    startTransition(async () => {
      if (await changeExpenseApprovalAction(expId, false, agencyId)) {
        toast.info(t("RejectSuccess"))
      } else {
        toast.success(t("RejectError"))
      }
      router.refresh()
    })
  }

  return (
    <RyogoApprovalTooltip
      label={isApproved ? t("Approved") : t("Approve")}
      tooltipText={isApproved ? t("RejectTitle") : t("RejectTitle")}
      isApproved={isApproved}
      onClick={isApproved ? rejectExpense : approveExpense}
      disabled={isPending}
    />
  )
}
