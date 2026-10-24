"use client"

import {
  BadgeIndianRupee,
  BellDot,
  Car,
  ChartLine,
  CircleQuestionMark,
  House,
  IdCard,
  Megaphone,
  Search,
  Tickets,
  UserCog,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"
import RyogoSidebar, { MenuItemType } from "./ryogoSidebar"

export default function DashboardSidebar({ isOwner }: { isOwner: boolean }) {
  const t = useTranslations("Dashboard.Sidebar")

  // Content Menu items
  const contentItems: MenuItemType[] = [
    {
      title: t("Home"),
      url: "/dashboard/home",
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
      icon: Users,
      onlyOwner: true,
    },
    {
      title: t("Analytics"),
      url: "/dashboard/analytics",
      icon: ChartLine,
      onlyOwner: true,
    },
    {
      title: t("Search"),
      url: "/dashboard/search",
      icon: Search,
    },
  ]

  //Footer menu items
  const footerItems: MenuItemType[] = [
    {
      title: t("Missions"),
      url: "/dashboard/missions",
      icon: BellDot,
    },
    {
      title: t("Feed"),
      url: "/dashboard/feed",
      icon: Megaphone,
    },
    {
      title: t("Support"),
      url: "/dashboard/support",
      icon: CircleQuestionMark,
    },
    {
      title: t("Account"),
      url: "/dashboard/account",
      icon: UserCog,
    },
  ]

  return (
    <RyogoSidebar
      contentItems={contentItems}
      footerItems={footerItems}
      isOwner={isOwner}
    />
  )
}
