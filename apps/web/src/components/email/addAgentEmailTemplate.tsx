interface EmailTemplateProps {
  name: string
  password: string
}

export function AddAgentEmailTemplate({ name, password }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <h5>
        Your new password is: <b>{password}</b>
      </h5>
    </div>
  )
}
