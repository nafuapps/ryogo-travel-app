import EmailFooter from "./emailFooter"

export function AddSupportTicketEmailTemplate({
  id,
  userId,
  agencyId,
  issue,
  details,
}: {
  id: string
  userId: string
  agencyId: string
  issue: string
  details?: string | null
}) {
  return (
    <div>
      <h4>Received a new support ticket on RyoGo!</h4>
      <p>
        TicketId: <b>{id}</b>
      </p>
      <p>Here are the details of your query:</p>
      <ul>
        <li>
          <strong>UserId:</strong> {userId}
        </li>
        <li>
          <strong>AgencyId:</strong> {agencyId}
        </li>
        <li>
          <strong>Issue:</strong> {issue}
        </li>
        {details && (
          <li>
            <strong>Details:</strong> {details}
          </li>
        )}
      </ul>
      <EmailFooter />
    </div>
  )
}
