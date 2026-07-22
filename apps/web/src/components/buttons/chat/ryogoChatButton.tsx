"use client"

import { MessageSquare } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
import getChatLink from "@/components/whatsapp/getChatLink"

export default function RyogoChatButton({
  label,
  phone,
}: {
  label: string
  phone: string
}) {
  function startChat() {
    window.open(getChatLink(phone), "_blank", "noopener,noreferrer")
  }

  return (
    <Button variant="outline" onClick={startChat}>
      <RyogoIcon icon={MessageSquare} size="sm" color="slate" />
      <RyogoCaption color="slate">{label}</RyogoCaption>
    </Button>
  )
}
