import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
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
