"use client"

import { Button } from "@/components/ui/button"
import { MapPinned } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { useTranslations } from "next-intl"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getBookingTrackingLink } from "@/lib/utils"

export default function ShareTrackBookingLinkButton(props: {
  bookingId: string
  phone: string
  label: string
}) {
  const t = useTranslations("Dashboard.Whatsapp")

  // Send track booking link to customer over whatsapp
  function sendTrackingLink() {
    const bookingLink = getBookingTrackingLink(
      props.bookingId,
      window.location.origin,
    )
    const message = t("TrackBooking", {
      bookingLink: bookingLink,
    })
    const messageLink = getWhatsappMessageLink(props.phone, message)
    window.open(messageLink, "_blank", "noopener,noreferrer")
  }

  return (
    <Button variant={"outline"} onClick={sendTrackingLink}>
      <RyogoIcon icon={MapPinned} size="sm" color="slate" />
      <RyogoCaption color="slate">{props.label}</RyogoCaption>
    </Button>
  )
}
