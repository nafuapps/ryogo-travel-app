"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { RyoGoSidebarLogo } from "@/components/logo"
import { RyogoSmall } from "@/components/typography"
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default function RyogoSidebar(props: {
  contentItems: MenuItemType
  footerItems: MenuItemType
  isOwner: boolean
}) {
  const { isMobile, open, openMobile } = useSidebar()
  const pathname = usePathname()

  const sidebarOpen = open || openMobile

  return (
    <Sidebar
      side="left"
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="h-full bg-slate-50 dark:bg-slate-800"
    >
      <SidebarHeader className="mb-3">
        <RyoGoSidebarLogo open={sidebarOpen} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        {props.contentItems.map(
          (item) =>
            //Show onlyOwner items only if isOwner
            (item.onlyOwner ? props.isOwner : true) && (
              <MenuButton
                key={item.title}
                {...item}
                open={sidebarOpen}
                active={pathname.includes(item.url as string)}
              />
            ),
        )}
      </SidebarContent>
      <SidebarFooter className="mb-3">
        {props.footerItems.map((item) => (
          <MenuButton
            key={item.title}
            {...item}
            open={sidebarOpen}
            active={pathname.includes(item.url as string)}
          />
        ))}
      </SidebarFooter>
    </Sidebar>
  )
}

export type MenuItemType = {
  title: string
  url: React.ComponentProps<typeof Link>["href"]
  icon: LucideIcon
  onlyOwner?: boolean
}[]

function MenuButton(props: {
  title: string
  url: React.ComponentProps<typeof Link>["href"]
  icon: LucideIcon
  open: boolean
  active?: boolean
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <Link href={props.url} onClick={() => setOpenMobile(false)}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger className="w-full">
          <div
            className={`flex flex-row gap-3 lg:gap-4 items-center rounded-lg ${props.active ? "bg-sky-700 dark:bg-sky-300" : "hover:bg-sky-100 dark:hover:bg-sky-800"} w-full px-2.5 lg:px-3 py-3 transition
            `}
          >
            <RyogoIcon
              icon={props.icon}
              color={props.active ? "white" : "black"}
              size="sm"
            />
            {props.open && (
              <RyogoSmall color={props.active ? "white" : "slate"}>
                {props.title}
              </RyogoSmall>
            )}
          </div>
        </TooltipTrigger>
        {!props.open && <TooltipContent>{props.title}</TooltipContent>}
      </Tooltip>
    </Link>
  )
}
