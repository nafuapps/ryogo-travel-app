import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { RyogoCaption } from "@/components/typography"
import { LucideIcon } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default function HeaderButton({
  label,
  icon,
}: {
  label: string
  icon: LucideIcon
}) {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        <Button variant="outline" size={"default"}>
          <RyogoIcon icon={icon} size="sm" />
          <span className="hidden lg:flex">
            <RyogoCaption color="slate">{label}</RyogoCaption>
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex lg:hidden">{label}</TooltipContent>
    </Tooltip>
  )
}
