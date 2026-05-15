import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export function OnboardOwnerEmailTemplate({
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
      <h1>Welcome, {name}!</h1>
      <p>Thanks for joining RyoGo. Your account has been created.</p>
      <h5>
        Your verification code is: <b>{code}</b>
      </h5>
      <p>Use this code to verify your account here: {link}</p>
      <p>
        You can continue with the onboarding process to add vehicles, drivers
        and agents to your account and start taking new bookings.
      </p>
      <p>
        For any issues, contact our support team at {SUPPORT_EMAIL} or call us
        at ${SUPPORT_HELPLINE_NUMBER}
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
    </div>
  )
}
