import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export function ForgotPasswordCodeTemplate({
  name,
  code,
  link,
}: {
  name: string
  code: string
  link: string
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h5>
        Your have asked for resetting your password. Your code is: <b>{code}</b>
        !
      </h5>
      <p>Use this code to reset password here: {link}</p>
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
