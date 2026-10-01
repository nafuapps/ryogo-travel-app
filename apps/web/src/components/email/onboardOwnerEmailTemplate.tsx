import EmailFooter from "./emailFooter"

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
      <h2>Welcome, {name}!</h2>
      <p>Thanks for joining RyoGo. Your account has been created.</p>
      <p>Your verification code is:</p>
      <h3>{code}</h3>
      <p>Use this code to verify your account here: {link}</p>
      <p>
        You can continue with the onboarding process to add vehicles, drivers
        and agents to your account and start taking new bookings.
      </p>
      <EmailFooter />
    </div>
  )
}
