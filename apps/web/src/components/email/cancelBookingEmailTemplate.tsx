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
      <h2>Hello, {name}!</h2>
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
