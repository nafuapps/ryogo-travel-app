interface EmailTemplateProps {
  name: string
  password: string
}

export function AddDriverEmailTemplate({ name, password }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <h5>Your password has been reset. Your new password is: {password}!</h5>
    </div>
  )
}
