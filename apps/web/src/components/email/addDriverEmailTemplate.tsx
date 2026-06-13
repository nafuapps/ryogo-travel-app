import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export function AddDriverEmailTemplate({
  name,
  password,
  link,
}: {
  name: string
  password: string
  link: string
}) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>
        You have been added as a driver on RyoGo. We are excited to have you on
        board!
      </p>
      <p>
        Your password is: <b>{password}</b>
      </p>
      <p>Your can login to RyoGo with your phone number here: {link}</p>
      <p>
        For any issues, contact our support team at {SUPPORT_EMAIL} or call us
        at {SUPPORT_HELPLINE_NUMBER}
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
    </div>
  )
}
