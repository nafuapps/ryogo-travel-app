import { P, PLight } from "@/components/typography"
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { UrlObject } from "url"
import { useSidebar } from "@/components/ui/sidebar"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

type MenuButtonProps = {
  title: string
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>
  icon: LucideIcon
  open: boolean
  active?: boolean
}

const menuButtonClassName =
  "flex flex-row gap-3 items-center rounded-lg hover:bg-slate-200 text-slate-600 w-full px-2 py-2"

const activeMenuButtonClassName =
  "flex flex-row gap-3 items-center rounded-lg bg-sky-700 hover:bg-sky-700/90 text-sky-50 w-full px-2 py-2"

export function MenuButton(props: MenuButtonProps) {
  const { setOpenMobile } = useSidebar()

  return (
    <Link href={props.url} onClick={() => setOpenMobile(false)}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger className="w-full">
          <div
            className={
              props.active ? activeMenuButtonClassName : menuButtonClassName
            }
          >
            <RyogoIcon
              icon={props.icon}
              color={props.active ? "white" : "slate"}
              size="md"
            />
            {props.open &&
              (props.active ? (
                <PLight>{props.title}</PLight>
              ) : (
                <P>{props.title}</P>
              ))}
          </div>
        </TooltipTrigger>
        {!props.open && <TooltipContent>{props.title}</TooltipContent>}
      </Tooltip>
    </Link>
  )
}
