import EmailFooter from "./emailFooter"

export function AddOwnerEmailTemplate({
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
        You have been added as another owner on RyoGo. We are excited to have
        you on board!
      </p>
      <p>
        Your password is: <b>{password}</b>
      </p>
      <p>Your can login to RyoGo here: {link}</p>
      <EmailFooter />
    </div>
  )
}
