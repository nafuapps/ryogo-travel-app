import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

export type QuickActionType = {
  href: React.ComponentProps<typeof Link>["href"]
  label: string
  icon: LucideIcon
}

export default function QuickActionLinkButton({
  href,
  label,
  icon,
}: QuickActionType) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full justify-between">
        <RyogoCaption color="slate">{label}</RyogoCaption>
        <RyogoIcon icon={icon} size="sm" color="slate" />
      </Button>
    </Link>
  )
}
