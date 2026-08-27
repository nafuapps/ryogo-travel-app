import { RyogoGhostButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SupportContentCTALinkButton({
  label,
  href,
}: {
  label: string
  href: React.ComponentProps<typeof Link>["href"]
}) {
  return (
    <Link href={href} className="self-center">
      <RyogoGhostButton label={label} labelColor="brand">
        <RyogoIcon icon={ChevronRight} size="sm" color="brand" thick />
      </RyogoGhostButton>
    </Link>
  )
}
