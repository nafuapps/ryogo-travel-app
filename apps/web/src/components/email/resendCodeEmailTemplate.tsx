import EmailFooter from "./emailFooter"

export function resendCodeEmailTemplate({
  name,
  code,
}: {
  name: string
  code: string
}) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>Your new verification code is:</p>
      <h3>{code}</h3>
      <EmailFooter />
    </div>
  )
}
