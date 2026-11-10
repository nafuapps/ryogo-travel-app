import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { Mail } from "lucide-react"
import Link from "next/link"

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
    <Link href={`mailto:${email}`} prefetch={false}>
      <RyogoDetailedIconButton label={label} icon={Mail} subtitle={subtitle} />
    </Link>
  )
}
