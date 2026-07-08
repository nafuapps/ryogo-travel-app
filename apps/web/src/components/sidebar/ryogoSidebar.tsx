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
import { UrlObject } from "url"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default function RyogoSidebar({
  contentItems,
  footerItems,
  isOwner,
}: {
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
      className="h-full"
    >
      <SidebarHeader className={`my-3 ${sidebarOpen && "mx-4"}`}>
        <RyoGoSidebarLogo open={sidebarOpen} />
      </SidebarHeader>
      <SidebarContent className="px-2 my-3">
        {contentItems.map(
          (item) =>
            //Show onlyOwner items only if isOwner
            (item.onlyOwner ? isOwner : true) && (
              <MenuButton
                key={item.title}
                {...item}
                open={sidebarOpen}
                active={pathname === item.url}
              />
            ),
        )}
      </SidebarContent>
      <SidebarFooter className="my-3">
        {footerItems.map((item) => (
          <MenuButton
            key={item.title}
            {...item}
            open={sidebarOpen}
            active={pathname === item.url}
          />
        ))}
      </SidebarFooter>
    </Sidebar>
  )
}

export type MenuItemType = {
  title: string
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>
  icon: LucideIcon
  onlyOwner?: boolean
}[]

function MenuButton(props: {
  title: string
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>
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
