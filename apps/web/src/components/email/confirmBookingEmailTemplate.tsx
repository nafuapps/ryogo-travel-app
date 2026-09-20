import EmailFooter from "./emailFooter"

export function ConfirmBookingEmailTemplate({
  name,
  bookingId,
  route,
  date,
  downloadUrl,
  trackingUrl,
  assignedDriver,
  assignedVehicle,
}: {
  name: string
  bookingId: string
  route: string
  date: string
  downloadUrl: string
  trackingUrl: string
  assignedDriver?: string
  assignedVehicle?: string
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Your booking has been confirmed.</p>
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
        {assignedDriver && (
          <li>
            <strong>Assigned Driver: </strong> {assignedDriver}
          </li>
        )}
        {assignedVehicle && (
          <li>
            <strong>Assigned Vehicle: </strong> {assignedVehicle}
          </li>
        )}
      </ul>
      <p>You may download your booking confirmation here: {downloadUrl}:</p>
      <p>You can track live booking status here: {trackingUrl}:</p>
      <EmailFooter />
    </div>
  )
}
