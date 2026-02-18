import { JSX } from "react"
import { Resend } from "resend"

export default async function sendEmail(
  receipientEmail: string[],
  subject: string,
  element: JSX.Element,
) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: "RyoGo Support<support@nafuapps.in>",
    to: receipientEmail,
    subject: subject,
    react: element,
  })

  if (error) {
    console.log(error)
  }
}
