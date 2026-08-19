import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { RyogoCaption } from "@/components/typography"
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useRouter } from "next/navigation"

export default function HeaderButton(props: {
  label: string
  icon: LucideIcon
}) {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <RyogoIcon icon={props.icon} size="sm" />
          <RyogoCaption color="slate" className="hidden lg:flex">
            {props.label}
          </RyogoCaption>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex lg:hidden">{props.label}</TooltipContent>
    </Tooltip>
  )
}

export function HeaderBackButton() {
  const router = useRouter()
  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()}>
      <RyogoIcon icon={ChevronLeft} size="md" />
    </Button>
  )
}

export function HeaderForwardButton() {
  const router = useRouter()
  return (
    <Button variant="ghost" size="icon" onClick={() => router.forward()}>
      <RyogoIcon icon={ChevronRight} size="md" />
    </Button>
  )
}
