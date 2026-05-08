import { RyogoIcon } from "@/components/icons/RyogoIcon"
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
        className={`flex p-3 lg:pl-4 lg:gap-1 rounded-lg justify-center items-center lg:cursor-pointer transition ${
          isApproved
            ? "bg-green-200 hover:bg-red-200"
            : "bg-slate-200 hover:bg-slate-300"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="hidden lg:flex">
          <RyogoCaption color="light">{label}</RyogoCaption>
        </div>
        <RyogoIcon icon={isApproved ? CheckCheck : Check} size="sm" />
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  )
}
