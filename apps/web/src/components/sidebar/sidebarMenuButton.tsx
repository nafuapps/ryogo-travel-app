import { RyogoSmall } from "@/components/typography"
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { UrlObject } from "url"
import { useSidebar } from "@/components/ui/sidebar"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

type MenuButtonProps = {
  title: string
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>
  icon: LucideIcon
  open: boolean
  active?: boolean
}
export function MenuButton(props: MenuButtonProps) {
  const { setOpenMobile } = useSidebar()

  return (
    <Link href={props.url} onClick={() => setOpenMobile(false)}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger className="w-full">
          <div
            className={`flex flex-row gap-3 items-center rounded-lg ${props.active ? "bg-sky-700" : "hover:bg-sky-100"} w-full p-2 transition
            `}
          >
            <RyogoIcon
              icon={props.icon}
              color={props.active ? "white" : "slate"}
              size="md"
            />
            {props.open &&
              (props.active ? (
                <RyogoSmall color="white">{props.title}</RyogoSmall>
              ) : (
                <RyogoSmall>{props.title}</RyogoSmall>
              ))}
          </div>
        </TooltipTrigger>
        {!props.open && <TooltipContent>{props.title}</TooltipContent>}
      </Tooltip>
    </Link>
  )
}
