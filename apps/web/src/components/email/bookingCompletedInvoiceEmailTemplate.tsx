import EmailFooter from "./emailFooter"

export function BookingCompletedInvoiceEmailTemplate({
  name,
  bookingId,
  route,
  downloadUrl,
  trackUrl,
  code,
}: {
  name: string
  bookingId: string
  route: string
  downloadUrl: string
  trackUrl: string
  code: string | null
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
      <div className={`${code ? "" : "hidden"}`}>
        <p>
          You can provide your feedback rating for this booking here:
          {trackUrl}
        </p>
        <p>Your secret code is:</p>
        <h3>{code}</h3>
      </div>
      <br />
      <EmailFooter />
    </div>
  )
}
