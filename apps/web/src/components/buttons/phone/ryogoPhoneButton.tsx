import { Phone } from "lucide-react"
import Link from "next/link"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function RyogoPhoneButton({
  label,
  phone,
  subtitle,
}: {
  label: string
  phone: string
  subtitle?: string
}) {
  return (
    <Link href={`tel:${phone}`}>
      <RyogoDetailedIconButton label={label} icon={Phone} subtitle={subtitle} />
    </Link>
  )
}
