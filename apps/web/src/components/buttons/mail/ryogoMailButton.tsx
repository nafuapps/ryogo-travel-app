import { Mail } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RyogoMailButton({
  label,
  email,
}: {
  label: string
  email: string
}) {
  return (
    <Link href={`mailto:${email}`}>
      <Button variant="outline" className="w-full">
        <RyogoIcon icon={Mail} size="sm" color="slate" />
        <RyogoCaption color="slate">{label}</RyogoCaption>
      </Button>
    </Link>
  )
}
