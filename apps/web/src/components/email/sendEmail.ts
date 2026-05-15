import { JSX } from "react"
import { Resend } from "resend"

export default async function sendEmail(
  receipientEmail: string[],
  subject: string,
  element: JSX.Element,
  attachments?: { filename: string; path: string }[],
) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: "RyoGo Travel App<ryogo@nafuapps.in>",
    to: receipientEmail,
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
