"use client"

import { MapPinned } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useTranslations } from "next-intl"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getBookingTrackingLink } from "@/lib/utils"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function ShareTrackBookingLinkButton({
  bookingId,
  phone,
  label,
}: {
  bookingId: string
  phone: string
  label: string
}) {
  const t = useTranslations("Dashboard.Whatsapp")

  // Send track booking link to customer over whatsapp
  function sendTrackingLink() {
    const bookingLink = getBookingTrackingLink(
      bookingId,
      window.location.origin,
    )
    const message = t("TrackBooking", {
      bookingLink: bookingLink,
    })
    const messageLink = getWhatsappMessageLink(phone, message)
    window.open(messageLink, "_blank", "noopener,noreferrer")
  }

  return (
    <RyogoOutlineButton label={label} onClick={sendTrackingLink}>
      <RyogoIcon icon={MapPinned} size="sm" color="slate" />
    </RyogoOutlineButton>
  )
}
