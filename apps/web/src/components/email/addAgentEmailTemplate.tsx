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
      <p>Your password is:</p>
      <h3>{password}</h3>
      <br />
      <p>Your can login to RyoGo here: {link}</p>
      <EmailFooter />
    </div>
  )
}
