interface EmailTemplateProps {
  name: string
  code: string
}

export function resendCodeEmailTemplate({ name, code }: EmailTemplateProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>
        Your new verification code is: <b>{code}</b>
      </p>
      <p>For any issues, contact our support team or call us at 9840774089</p>
    </div>
  )
}
