"use server"

import sendEmail from "@/components/email/sendEmail"
import { SupportQueryEmailTemplate } from "@/components/email/supportQueryEmailTemplate"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"

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

  //TODO: Add the query to the database
  const query = { id: "123" }

  if (!query) {
    return
  }

  //Send query confirmation email
  sendEmail(
    [data.email, "nafuapps@gmail.com"],
    "RyoGo Support Query Confirmation",
    SupportQueryEmailTemplate({
      name: data.name,
      id: query.id,
      phone: data.phone,
      message: data.message,
      agencyName: data.agencyName,
    }),
  )

  return query
}
