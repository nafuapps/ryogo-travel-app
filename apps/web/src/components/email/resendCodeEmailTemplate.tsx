import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export function resendCodeEmailTemplate({
  name,
  code,
}: {
  name: string
  code: string
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h5>
        Your new verification code is: <b>{code}</b>
      </h5>
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
