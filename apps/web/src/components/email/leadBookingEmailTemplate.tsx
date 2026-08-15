import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export function LeadBookingEmailTemplate({
  name,
  bookingId,
  route,
  date,
  downloadUrl,
}: {
  name: string
  bookingId: string
  route: string
  date: string
  downloadUrl: string
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Your booking quotation has been created.</p>
      <p>Here are the details of your booking:</p>
      <ul>
        <li>
          <strong>BookingId:</strong> {bookingId}
        </li>
        <li>
          <strong>Route:</strong> {route}
        </li>
        <li>
          <strong>Date:</strong> {date}
        </li>
      </ul>
      <p>You may download your booking quotation here: {downloadUrl}:</p>
      <p>
        For any issues, contact our support team at {SUPPORT_EMAIL} or call us
        at {SUPPORT_HELPLINE_NUMBER}
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
    </div>
  )
}
