import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

export type SupportContentItemType = {
  id: string
  title: string
  icon: LucideIcon
  content: React.ReactNode
}

export default function SupportTableOfContentLinkButton({
  href,
  label,
  icon,
}: {
  href: React.ComponentProps<typeof Link>["href"]
  label: string
  icon: LucideIcon
}) {
  return (
    <Link href={href} replace>
      <RyogoGhostButton
        label={label}
        className="w-full justify-end flex-row-reverse"
        labelColor="slate"
      >
        <RyogoIcon icon={icon} size="sm" color="slate" />
      </RyogoGhostButton>
    </Link>
  )
}
