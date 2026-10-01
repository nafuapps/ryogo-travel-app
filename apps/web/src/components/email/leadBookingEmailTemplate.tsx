import EmailFooter from "./emailFooter"

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
      <h2>Hello, {name}!</h2>
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
      <EmailFooter />
    </div>
  )
}
