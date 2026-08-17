"use server"

import sendEmail from "@/components/email/sendEmail"
import { SupportQueryEmailTemplate } from "@/components/email/supportQueryEmailTemplate"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"

export async function sendSupportQueryAction(data: {
  name: string
  email: string
  phone: string
  message: string
  agencyName?: string
}) {
  const currentUser = await getCurrentUser()
  if (currentUser) {
    redirect("/dashboard", RedirectType.replace)
  }

  //Add the query to the database
  const supportQuery = await supportServices.addSupportQuery({
    email: data.email,
    message: data.message,
    name: data.name,
    phone: data.phone,
    businessName: data.agencyName,
  })

  if (!supportQuery) {
    return
  }

  //Send query creation email
  sendEmail({
    receipientEmail: [data.email],
    cc: [SUPPORT_EMAIL],
    subject: "RyoGo Support Query",
    element: SupportQueryEmailTemplate({
      name: data.name,
      id: supportQuery.id,
      phone: data.phone,
      message: data.message,
      agencyName: data.agencyName,
    }),
  })

  return supportQuery
}
