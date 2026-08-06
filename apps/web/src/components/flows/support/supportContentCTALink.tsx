import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
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
      <Button variant="ghost" type="button" size="sm">
        <RyogoCaption weight="font-bold" color="brand">
          {label}
        </RyogoCaption>
        <RyogoIcon icon={ChevronRight} size="sm" color="brand" thick />
      </Button>
    </Link>
  )
}
