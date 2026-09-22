"use client"

import { useTranslations } from "next-intl"
import { changeExpenseApprovalAction } from "@/app/actions/expenses/changeExpenseApprovalAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Check, CheckCheck } from "lucide-react"

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

  if (isApproved) {
    return (
      <RyogoGhostButton
        label={t("Approved")}
        labelColor={"green"}
        onClick={rejectExpense}
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
      onClick={approveExpense}
      disabled={isPending}
      className="grow"
    >
      <RyogoIcon icon={Check} size="xs" color={"slate"} thick />
    </RyogoOutlineButton>
  )
}
