import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { UrlObject } from "url"

export type SupportContentItemType = {
  id: string
  title: string
  icon: LucideIcon
  content: React.ReactNode
}

export default function TableContentLinkButton({
  href,
  label,
  icon,
}: {
  href: UrlObject | __next_route_internal_types__.RouteImpl<UrlObject>
  label: string
  icon: LucideIcon
}) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-start">
        <RyogoIcon icon={icon} size="sm" color="slate" />
        <RyogoCaption
          color="slate"
          weight="font-normal"
          className="text-wrap text-left"
        >
          {label}
        </RyogoCaption>
      </Button>
    </Link>
  )
}
