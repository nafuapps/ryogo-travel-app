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

export type MenuItemType = {
  title: string
  url: React.ComponentProps<typeof Link>["href"]
  icon: LucideIcon
  onlyOwner?: boolean
}

export default function RyogoSidebar({
  contentItems,
  footerItems,
  isOwner,
}: {
  contentItems: MenuItemType[]
  footerItems: MenuItemType[]
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
        {contentItems.map(
          (item) =>
            //Show onlyOwner items only if isOwner
            (item.onlyOwner ? isOwner : true) && (
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
        {footerItems.map((item) => (
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

function MenuButton({
  title,
  url,
  icon,
  open,
  active,
}: {
  title: string
  url: React.ComponentProps<typeof Link>["href"]
  icon: LucideIcon
  open: boolean
  active?: boolean
}) {
  const { setOpenMobile } = useSidebar()

  return (
    <Link href={url} onClick={() => setOpenMobile(false)}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger className="w-full">
          <div
            className={`flex flex-row gap-3 md:gap-4 items-center rounded-lg ${active ? "bg-sky-700 dark:bg-sky-300" : "hover:bg-sky-100 dark:hover:bg-sky-800"} w-full px-2.5 md:px-3 py-3 transition
            `}
          >
            <RyogoIcon
              icon={icon}
              color={active ? "white" : "black"}
              size="sm"
            />
            {open && (
              <RyogoSmall color={active ? "white" : "slate"}>
                {title}
              </RyogoSmall>
            )}
          </div>
        </TooltipTrigger>
        {!open && <TooltipContent>{title}</TooltipContent>}
      </Tooltip>
    </Link>
  )
}
