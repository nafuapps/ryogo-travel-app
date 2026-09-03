"use client"

import { MessageSquare } from "lucide-react"
import getWhatsappChatLink from "@/components/whatsapp/getWhatsappChatLink"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function RyogoChatButton({
  label,
  phone,
  subtitle,
}: {
  label: string
  phone: string
  subtitle?: string
}) {
  function startChat() {
    window.open(getWhatsappChatLink(phone), "_blank", "noopener,noreferrer")
  }

  return (
    <RyogoDetailedIconButton
      label={label}
      icon={MessageSquare}
      subtitle={subtitle}
      onClick={startChat}
    />
  )
}
