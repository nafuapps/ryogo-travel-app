"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BellDot, ChevronLeft, Plus } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useRouter } from "next/navigation"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

type HeaderButtonType = "newBooking" | "missions"

function getHeaderButtonIcon(type: HeaderButtonType) {
  switch (type) {
    case "newBooking":
      return Plus
    case "missions":
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
        <RyogoOutlineButton
          label={props.label}
          labelClassName="hidden lg:flex"
          className="flex-row-reverse"
        >
          <RyogoIcon icon={getHeaderButtonIcon(props.type)} size="sm" />
        </RyogoOutlineButton>
      </TooltipTrigger>
      <TooltipContent className="flex lg:hidden">{props.label}</TooltipContent>
    </Tooltip>
  )
}

export function HeaderBackButton() {
  const router = useRouter()
  return (
    <RyogoGhostButton
      onClick={() => router.back()}
      className="has-[>svg]:px-1 has-[>svg]:lg:px-1"
    >
      <RyogoIcon icon={ChevronLeft} size="md" />
    </RyogoGhostButton>
  )
}
