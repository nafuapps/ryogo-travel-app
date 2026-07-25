import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

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
      <p>
        For any urgent matters, you can also reach us at {SUPPORT_EMAIL} or call
        us at {SUPPORT_HELPLINE_NUMBER}.
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
    </div>
  )
}
