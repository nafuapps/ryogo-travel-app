"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { RyogoCaption } from "@/components/typography"
import { BellDot, ChevronLeft, Plus } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useRouter } from "next/navigation"

type HeaderButtonType = "newBooking" | "missionControl"

function getHeaderButtonIcon(type: HeaderButtonType) {
  switch (type) {
    case "newBooking":
      return Plus
    case "missionControl":
      return BellDot
  }
}

export default function HeaderButton(props: {
  label: string
  type: HeaderButtonType
}) {
  return (
    <Tooltip disableHoverableContent>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <RyogoIcon icon={getHeaderButtonIcon(props.type)} size="sm" />
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
