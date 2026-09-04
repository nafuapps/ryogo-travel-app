"use client"

import { useTranslations } from "next-intl"
import { House, Tickets, Car, CircleQuestionMark, UserCog } from "lucide-react"
import RyogoSidebar, { MenuItemType } from "./ryogoSidebar"

export default function RiderSidebar() {
  const t = useTranslations("Rider.Sidebar")

  // Content Menu items
  const contentItems: MenuItemType[] = [
    {
      title: t("Home"),
      url: "/rider/home",
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
  const footerItems: MenuItemType[] = [
    {
      title: t("Support"),
      url: "/rider/mySupport",
      icon: CircleQuestionMark,
    },
    {
      title: t("Profile"),
      url: "/rider/myProfile",
      icon: UserCog,
    },
  ]

  return (
    <RyogoSidebar
      contentItems={contentItems}
      footerItems={footerItems}
      isOwner={false}
    />
  )
}
