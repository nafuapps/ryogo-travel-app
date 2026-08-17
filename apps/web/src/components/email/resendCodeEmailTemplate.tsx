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
      <h1>Hello, {name}!</h1>
      <p>
        Your new verification code is: <b>{code}</b>
      </p>
      <EmailFooter />
    </div>
  )
}
