import { Mail } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import Link from "next/link"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function RyogoMailButton({
  label,
  email,
}: {
  label: string
  email: string
}) {
  return (
    <Link href={`mailto:${email}`}>
      <RyogoOutlineButton label={label} className="w-full">
        <RyogoIcon icon={Mail} size="sm" color="slate" />
      </RyogoOutlineButton>
    </Link>
  )
}
