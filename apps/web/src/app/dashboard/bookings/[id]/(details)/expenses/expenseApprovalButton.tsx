"use client"

import { useTranslations } from "next-intl"
import { changeExpenseStatusAction } from "./changeExpenseStatusAction"
import { toast } from "sonner"
import { CaptionGrey } from "@/components/typography"
import { LucideCheckCheck, LucideCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip"

export function ExpenseApprovalButton({
  expId,
  isApproved,
}: {
  expId: string
  isApproved: boolean
}) {
  const t = useTranslations("Dashboard.BookingExpenses")
  const router = useRouter()

  async function approveExpense() {
    if (await changeExpenseStatusAction(expId, true)) {
      toast.success(t("ApproveSuccess"))
    } else {
      toast.success(t("ApproveError"))
    }
    router.refresh()
  }

  async function rejectExpense() {
    if (await changeExpenseStatusAction(expId, false)) {
      toast.info(t("RejectSuccess"))
    } else {
      toast.success(t("RejectError"))
    }
    router.refresh()
  }

  return isApproved ? (
    <Tooltip disableHoverableContent>
      <TooltipTrigger
        className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-green-200 justify-center items-center hover:bg-red-200 lg:cursor-pointer transition"
        onClick={rejectExpense}
      >
        <div className="hidden lg:flex">
          <CaptionGrey>{t("Approved")}</CaptionGrey>
        </div>
        {<LucideCheckCheck className="size-4 lg:size-5 text-slate-500" />}
      </TooltipTrigger>
      <TooltipContent>{t("RejectTitle")}</TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip disableHoverableContent>
      <TooltipTrigger
        className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 justify-center items-center hover:bg-slate-300 lg:cursor-pointer transition"
        onClick={approveExpense}
      >
        <div className="hidden lg:flex">
          <CaptionGrey>{t("Approve")}</CaptionGrey>
        </div>
        {<LucideCheck className="size-4 lg:size-5 text-slate-500" />}
      </TooltipTrigger>
      <TooltipContent>{t("ApproveTitle")}</TooltipContent>
    </Tooltip>
  )
}
