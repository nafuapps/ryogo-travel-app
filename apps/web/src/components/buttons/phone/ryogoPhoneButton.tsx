import { Phone } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RyogoPhoneButton({
  label,
  phone,
}: {
  label: string
  phone: string
}) {
  return (
    <Link href={`tel:${phone}`}>
      <Button variant="outline" className="w-full">
        <RyogoIcon icon={Phone} size="sm" color="slate" />
        <RyogoCaption color="slate">{label}</RyogoCaption>
      </Button>
    </Link>
  )
}
