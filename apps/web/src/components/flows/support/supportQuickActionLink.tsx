import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

export type SupportQuickActionType = {
  href: React.ComponentProps<typeof Link>["href"]
  label: string
  icon: LucideIcon
}

export default function SupportQuickActionLinkButton({
  href,
  label,
  icon,
}: SupportQuickActionType) {
  return (
    <Link href={href}>
      <RyogoOutlineButton label={label} className="w-full justify-between">
        <RyogoIcon icon={icon} size="sm" color="slate" />
      </RyogoOutlineButton>
    </Link>
  )
}
