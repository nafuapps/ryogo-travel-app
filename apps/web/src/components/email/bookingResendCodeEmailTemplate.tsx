import EmailFooter from "./emailFooter"

export function BookingResendCodeEmailTemplate({
  name,
  trackUrl,
  code,
}: {
  name: string
  trackUrl: string
  code: string | null
}) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>Your secret code for providing booking feedback is:</p>
      <h3>{code}</h3>
      <p>
        You can provide your feedback rating for this booking here: {trackUrl}
      </p>
      <EmailFooter />
    </div>
  )
}
