"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import {
  House,
  Tickets,
  Car,
  IdCard,
  ChartLine,
  BadgeIndianRupee,
  UserRoundPen,
  Search,
  Megaphone,
  UserRoundCog,
} from "lucide-react"
import { MenuButton } from "@/components/sidebar/sidebarMenuButton"
import { MenuItemType } from "@/components/sidebar/sidebarCommon"
import { usePathname } from "next/navigation"
import { RyoGoSidebarLogo } from "@/components/logo"

export default function DashboardSidebar(props: { isOwner: boolean }) {
  const { isMobile, open, openMobile } = useSidebar()
  const t = useTranslations("Dashboard.Sidebar")
  const pathname = usePathname()

  const sidebarOpen = open || openMobile

  // Content Menu items
  const contentItems: MenuItemType = [
    {
      title: t("Home"),
      url: "/dashboard",
      icon: House,
    },
    {
      title: t("Bookings"),
      url: "/dashboard/bookings",
      icon: Tickets,
    },
    {
      title: t("Vehicles"),
      url: "/dashboard/vehicles",
      icon: Car,
    },
    {
      title: t("Drivers"),
      url: "/dashboard/drivers",
      icon: IdCard,
    },
    {
      title: t("Customers"),
      url: "/dashboard/customers",
      icon: BadgeIndianRupee,
    },
    {
      title: t("Users"),
      url: "/dashboard/users",
      icon: UserRoundCog,
      onlyOwner: true,
    },
    {
      title: t("Analytics"),
      url: "/dashboard/analytics",
      icon: ChartLine,
      onlyOwner: true,
    },
  ]

  //Footer menu items
  const footerItems: MenuItemType = [
    {
      title: t("Search"),
      url: "/dashboard/search",
      icon: Search,
    },
    {
      title: t("Feed"),
      url: "/dashboard/feed",
      icon: Megaphone,
    },
    {
      title: t("Account"),
      url: "/dashboard/account",
      icon: UserRoundPen,
    },
  ]

  return (
    <Sidebar
      id="DashboardSidebar"
      side="left"
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="h-full"
    >
      <SidebarHeader className="my-4 items-center">
        <RyoGoSidebarLogo open={sidebarOpen} />
      </SidebarHeader>
      <SidebarContent className="px-2 my-4">
        {contentItems.map(
          (item) =>
            //Show onlyOwner items only if isOwner
            (item.onlyOwner ? props.isOwner : true) && (
              <MenuButton
                key={item.title}
                {...item}
                open={sidebarOpen}
                active={pathname === item.url}
              />
            ),
        )}
      </SidebarContent>
      <SidebarFooter className="my-4">
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
