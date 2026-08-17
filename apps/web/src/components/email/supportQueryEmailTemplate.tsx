import EmailFooter from "./emailFooter"

export function SupportQueryEmailTemplate({
  name,
  id,
  phone,
  message,
  agencyName,
}: {
  name: string
  id: string
  phone: string
  message: string
  agencyName?: string
}) {
  return (
    <div>
      <p>Hello {name}!</p>
      <p>
        Thank you for contacting RyoGo support team. We have received your query
        and will get back to you as soon as possible.
      </p>
      <p>
        Your query Id is <b>{id}</b>
      </p>
      <p>Here are the details of your query:</p>
      <ul>
        <li>
          <strong>Phone:</strong> {phone}
        </li>
        <li>
          <strong>Message:</strong> {message}
        </li>
        {agencyName && (
          <li>
            <strong>Agency Name:</strong> {agencyName}
          </li>
        )}
      </ul>
      <EmailFooter />
    </div>
  )
}
