"use server"

import sendEmail from "@/components/email/sendEmail"
import { SupportQueryEmailTemplate } from "@/components/email/supportQueryEmailTemplate"
import { readPermissions } from "@/lib/permissions"
import { SUPPORT_EMAIL } from "@/lib/uiConfig"
import { supportServices } from "@ryogo-travel-app/api/services/support.services"

export async function sendSupportQueryAction(data: {
  name: string
  email: string
  phone: string
  message: string
  agencyName?: string
}) {
  await readPermissions.redirectIfAuthenticated()

  //Add the query to the database
  const supportQuery = await supportServices.addSupportQuery({
    ...data,
    businessName: data.agencyName,
  })

  if (!supportQuery) {
    return
  }

  //Send query creation email
  await sendEmail({
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
