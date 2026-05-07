import { LucideIcon } from "lucide-react"
import { UrlObject } from "url"

export type MenuItemType = {
  title: string
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>
  icon: LucideIcon
  onlyOwner?: boolean
}[]
