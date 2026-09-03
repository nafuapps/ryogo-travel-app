"use client"

import { MapPinned } from "lucide-react"
import { useTranslations } from "next-intl"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getBookingTrackingLink } from "@/lib/utils"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function ShareTrackBookingLinkButton({
  bookingId,
  phone,
  label,
  subtitle,
}: {
  bookingId: string
  phone: string
  label: string
  subtitle?: string
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
    <RyogoDetailedIconButton
      label={label}
      icon={MapPinned}
      onClick={sendTrackingLink}
      subtitle={subtitle}
    />
  )
}
