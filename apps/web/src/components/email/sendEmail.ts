import { JSX } from "react"
import { Attachment, Resend } from "resend"

export default async function sendEmail({
  receipientEmail,
  subject,
  element,
  cc,
  bcc,
  attachments,
}: {
  receipientEmail: string[]
  subject: string
  element: JSX.Element
  cc?: string[]
  bcc?: string[]
  attachments?: Attachment[]
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: "RyoGo Travel App <support@ryogo.in>",
    to: receipientEmail,
    cc: cc,
    bcc: bcc,
    subject: subject,
    react: element,
    attachments: attachments,
  })

  if (data) {
    console.log(data)
  }
  if (error) {
    console.log(error)
  }
  return { data, error }
}
