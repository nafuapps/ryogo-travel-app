"use client"

import { useTranslations } from "next-intl"
import { House, Waypoints } from "lucide-react"
import RyogoSidebar, { MenuItemType } from "./ryogoSidebar"

export default function TrackSidebar() {
  const t = useTranslations("Track.Sidebar")

  // Content Menu items
  const contentItems: MenuItemType[] = [
    {
      title: t("Home"),
      url: "/home",
      icon: House,
    },
    {
      title: t("Track"),
      url: "/track/booking",
      icon: Waypoints,
    },
  ]

  return <RyogoSidebar contentItems={contentItems} isOwner={false} />
}
