interface EmailTemplateProps {
  name: string
}

export function OnboardOwnerEmailTemplate({ name }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <h5>Thanks for joining RyoGo. Your account has been created.</h5>
      <p>
        You can continue with the onboarding process to add vehicles, drivers
        and agents to your account and start taking new bookings.
      </p>
      <p>For any issues, contact our support team or call us at 9840774089</p>
    </div>
  )
}
