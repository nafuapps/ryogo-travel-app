import EmailFooter from "./emailFooter"

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
      <p>
        Your have asked for resetting your password. Your code is: <b>{code}</b>
      </p>
      <p>Use this code to reset password here: {link}</p>
      <EmailFooter />
    </div>
  )
}
