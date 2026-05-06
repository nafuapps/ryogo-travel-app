interface EmailTemplateProps {
  name: string
  code: string
  link: string
}

export function ForgotPasswordCodeTemplate({
  name,
  code,
  link,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h5>
        Your have asked for resetting your password. Your code is: <b>{code}</b>
        !
      </h5>
      <h5>Use this code to reset password here: {link}</h5>
    </div>
  )
}
