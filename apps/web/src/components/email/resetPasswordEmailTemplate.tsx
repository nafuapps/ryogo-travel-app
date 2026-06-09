import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export function ResetPasswordEmailTemplate({
  name,
  password,
}: {
  name: string
  password: string
}) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>
        Your password has been reset. Your new password is: <b>{password}</b>
      </p>
      <p>
        For any issues, contact our support team at {SUPPORT_EMAIL} or call us
        at
        {SUPPORT_HELPLINE_NUMBER}
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
    </div>
  )
}
