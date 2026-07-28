import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Check, CheckCheck } from "lucide-react"

export default function RyogoApprovalTooltip({
  label,
  tooltipText,
  onClick,
  disabled,
  isApproved,
}: {
  label: string
  tooltipText: string
  onClick: () => void
  disabled: boolean
  isApproved: boolean
}) {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger
        className={`flex px-3 py-2 lg:gap-1 rounded-lg justify-center items-center transition ${
          isApproved
            ? "bg-green-200 dark:bg-green-700 hover:bg-red-200 dark:hover:bg-red-700"
            : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <RyogoCaption color="slate" className="hidden lg:flex">
          {label}
        </RyogoCaption>
        <RyogoIcon icon={isApproved ? CheckCheck : Check} size="sm" />
      </TooltipTrigger>
      <TooltipContent>
        <RyogoCaption color="white">{tooltipText}</RyogoCaption>
      </TooltipContent>
    </Tooltip>
  )
}
