"use client"

import { useTranslations } from "next-intl"

export default function AddMySupportTicketPageComponent({
  userId,
  agencyId,
}: {
  userId: string
  agencyId: string
}) {
  const t = useTranslations("Rider.AddMySupportTicket")
  return <div></div>
}
