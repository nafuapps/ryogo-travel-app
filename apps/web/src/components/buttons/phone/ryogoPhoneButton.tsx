import { Phone } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import Link from "next/link"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function RyogoPhoneButton({
  label,
  phone,
}: {
  label: string
  phone: string
}) {
  return (
    <Link href={`tel:${phone}`}>
      <RyogoOutlineButton label={label} className="w-full">
        <RyogoIcon icon={Phone} size="sm" color="slate" />
      </RyogoOutlineButton>
    </Link>
  )
}
