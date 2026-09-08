import { Mail } from "lucide-react"
import Link from "next/link"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function RyogoMailButton({
  label,
  email,
  subtitle,
}: {
  label: string
  email: string
  subtitle?: string
}) {
  return (
    <Link href={`mailto:${email}`}>
      <RyogoDetailedIconButton label={label} icon={Mail} subtitle={subtitle} />
    </Link>
  )
}
