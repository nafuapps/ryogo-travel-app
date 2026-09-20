import EmailFooter from "./emailFooter"

export function CancelBookingEmailTemplate({
  name,
  bookingId,
  route,
  date,
}: {
  name: string
  bookingId: string
  route: string
  date: string
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Your booking has been cancelled.</p>
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
      <EmailFooter />
    </div>
  )
}
