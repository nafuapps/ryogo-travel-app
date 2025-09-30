"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";
import {
  House,
  Tickets,
  Car,
  IdCard,
  ChartLine,
  ShieldUser,
  BadgeIndianRupee,
  UserRoundPen,
} from "lucide-react";
import { MenuButton } from "../../components/sidebar/sidebarMenuButton";
import { SidebarHeaderItem } from "../../components/sidebar/sidebarHeaderItem";
import { MenuItemType } from "../../components/sidebar/sidebarCommon";

export default function DashboardSidebar(props: { isOwner: boolean }) {
  const { isMobile, open, openMobile } = useSidebar();
  const t = useTranslations("Dashboard.Sidebar");

  const sidebarOpen = open || openMobile;

  // Content Menu items
  const contentItems: MenuItemType = [
    {
      title: t("Home"),
      url: "/dashboard",
      icon: House,
      onlyOwner: false,
    },
    {
      title: t("Bookings"),
      url: "/dashboard/bookings",
      icon: Tickets,
      onlyOwner: false,
    },
    {
      title: t("Vehicles"),
      url: "/dashboard/vehicles",
      icon: Car,
      onlyOwner: false,
    },
    {
      title: t("Drivers"),
      url: "/dashboard/drivers",
      icon: IdCard,
      onlyOwner: false,
    },
    {
      title: t("Customers"),
      url: "/dashboard/customers",
      icon: BadgeIndianRupee,
      onlyOwner: false,
    },
    {
      title: t("Users"),
      url: "/dashboard/users",
      icon: ShieldUser,
      onlyOwner: true,
    },
    {
      title: t("Analytics"),
      url: "/dashboard/analytics",
      icon: ChartLine,
      onlyOwner: true,
    },
  ];

  //Footer menu items
  const footerItems: MenuItemType = [
    {
      title: t("Account"),
      url: "/dashboard/account",
      icon: UserRoundPen,
      onlyOwner: false,
    },
  ];

  return (
    <Sidebar
      side="left"
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="h-full"
    >
      <SidebarHeader className="my-4">
        <SidebarHeaderItem
          open={sidebarOpen}
          title={t("Title")}
          subtitle={t("Subtitle")}
        />
      </SidebarHeader>
      <SidebarContent className="px-2 my-4">
        {contentItems.map((item) =>
          item.onlyOwner ? (
            props.isOwner && (
              <MenuButton key={item.title} {...item} open={sidebarOpen} />
            )
          ) : (
            <MenuButton key={item.title} {...item} open={sidebarOpen} />
          )
        )}
      </SidebarContent>
      <SidebarFooter className="my-4">
        {footerItems.map((item) => (
          <MenuButton key={item.title} {...item} open={sidebarOpen} />
        ))}
      </SidebarFooter>
    </Sidebar>
  );
}
