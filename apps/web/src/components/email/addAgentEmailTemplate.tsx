import EmailFooter from "./emailFooter"

export function AddAgentEmailTemplate({
  name,
  password,
  link,
}: {
  name: string
  password: string
  link: string
}) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>
        You have been added as an agent on RyoGo. We are excited to have you on
        board!
      </p>
      <p>
        Your password is: <b>{password}</b>
      </p>
      <p>Your can login to RyoGo with your phone number here: {link}</p>
      <EmailFooter />
    </div>
  )
}
