import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { UrlObject } from "url"

export default function SupportContentLinkButton({
  label,
  href,
}: {
  label: string
  href: UrlObject | __next_route_internal_types__.RouteImpl<UrlObject>
}) {
  return (
    <Link href={href} className="self-center">
      <Button
        variant="link"
        type="button"
        size="sm"
        className="gap-1 lg:gap-1.5 hover:bg-slate-50/80 dark:hover:bg-slate-900/80 hover:no-underline"
      >
        <RyogoCaption weight="font-bold" color="brand">
          {label}
        </RyogoCaption>
        <RyogoIcon icon={ChevronRight} size="sm" color="brand" thick />
      </Button>
    </Link>
  )
}
