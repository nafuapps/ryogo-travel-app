import EmailFooter from "./emailFooter"

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
      <EmailFooter />
    </div>
  )
}
