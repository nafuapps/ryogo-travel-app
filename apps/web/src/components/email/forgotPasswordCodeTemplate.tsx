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
      <h2>Hello, {name}!</h2>
      <p>Your have asked for resetting your password. Your code is:</p>
      <h3>{code}</h3>
      <p>Use this code to reset your password here: {link}</p>
      <EmailFooter />
    </div>
  )
}
