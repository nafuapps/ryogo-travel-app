"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { House, Tickets, Car, UserRoundPen } from "lucide-react"
import { MenuButton } from "@/components/sidebar/sidebarMenuButton"
import { SidebarLogoItem } from "@/components/sidebar/sidebarLogoItem"
import { MenuItemType } from "@/components/sidebar/sidebarCommon"
import { usePathname } from "next/navigation"

export default function RiderSidebar() {
  const { isMobile, open, openMobile } = useSidebar()
  const t = useTranslations("Rider.Sidebar")
  const pathname = usePathname()

  const sidebarOpen = open || openMobile

  // Content Menu items
  const contentItems: MenuItemType = [
    {
      title: t("Home"),
      url: "/rider",
      icon: House,
    },
    {
      title: t("Bookings"),
      url: "/rider/myBookings",
      icon: Tickets,
    },
    {
      title: t("Vehicle"),
      url: "/rider/myVehicle",
      icon: Car,
    },
  ]

  //Footer menu items
  const footerItems: MenuItemType = [
    {
      title: t("Profile"),
      url: "/rider/myProfile",
      icon: UserRoundPen,
    },
  ]

  return (
    <Sidebar
      side="left"
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="h-full"
    >
      <SidebarHeader className="my-4">
        <SidebarLogoItem
          open={sidebarOpen}
          title={t("Title")}
          subtitle={t("Subtitle")}
        />
      </SidebarHeader>
      <SidebarContent className="px-2 my-4">
        {contentItems.map((item) => (
          <MenuButton
            key={item.title}
            {...item}
            open={sidebarOpen}
            active={pathname === item.url}
          />
        ))}
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
