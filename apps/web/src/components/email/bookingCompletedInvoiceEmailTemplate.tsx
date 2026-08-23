import EmailFooter from "./emailFooter"

export function BookingCompletedInvoiceEmailTemplate({
  name,
  bookingId,
  route,
  downloadUrl,
}: {
  name: string
  bookingId: string
  route: string
  downloadUrl: string
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>
        Your booking has been completed and invoice for the trip has been
        generated.
      </p>
      <ul>
        <li>
          <strong>BookingId:</strong> {bookingId}
        </li>
        <li>
          <strong>Route:</strong> {route}
        </li>
      </ul>
      <p>You may download your booking invoice here: {downloadUrl}:</p>
      <EmailFooter />
    </div>
  )
}
