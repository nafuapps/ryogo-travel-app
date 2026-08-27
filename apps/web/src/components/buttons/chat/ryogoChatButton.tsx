"use client"

import { MessageSquare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import getWhatsappChatLink from "@/components/whatsapp/getWhatsappChatLink"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function RyogoChatButton({
  label,
  phone,
}: {
  label: string
  phone: string
}) {
  function startChat() {
    window.open(getWhatsappChatLink(phone), "_blank", "noopener,noreferrer")
  }

  return (
    <RyogoOutlineButton label={label} onClick={startChat}>
      <RyogoIcon icon={MessageSquare} size="sm" color="slate" />
    </RyogoOutlineButton>
  )
}
