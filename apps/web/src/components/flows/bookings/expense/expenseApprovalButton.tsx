"use client"

import { changeExpenseApprovalAction } from "@/app/actions/expenses/changeExpenseApprovalAction"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Check, CheckCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export function ExpenseApprovalButton({
  expenseId,
  isApproved,
  agencyId,
  canEditExpense,
  assignedUserId,
  isRider,
}: {
  expenseId: string
  isApproved: boolean
  agencyId: string
  canEditExpense: boolean
  assignedUserId: string
  isRider?: boolean
}) {
  const t = useTranslations("Dashboard.BookingExpenses")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function approveExpense() {
    startTransition(async () => {
      if (
        await changeExpenseApprovalAction({
          expenseId,
          isApproved: true,
          agencyId,
          assignedUserId,
        })
      ) {
        toast.success(t("ApproveSuccess"))
      } else {
        toast.error(t("ApproveError"))
      }
      router.refresh()
    })
  }

  async function rejectExpense() {
    startTransition(async () => {
      if (
        await changeExpenseApprovalAction({
          expenseId,
          isApproved: false,
          agencyId,
          assignedUserId,
        })
      ) {
        toast.info(t("RejectSuccess"))
      } else {
        toast.error(t("RejectError"))
      }
      router.refresh()
    })
  }

  if (!isApproved) {
    if (isRider || !canEditExpense) return null
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

  return (
    <RyogoGhostButton
      label={t("Approved")}
      labelColor={"green"}
      onClick={rejectExpense}
      disabled={isPending || isRider || !canEditExpense}
      className="grow border"
    >
      <RyogoIcon icon={CheckCheck} size="xs" color={"green"} thick />
    </RyogoGhostButton>
  )
}
