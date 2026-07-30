export default function getTrackBookingLink(
  message: string,
  customerPhone: string,
) {
  return `https://wa.me/91${customerPhone}/?text=${encodeURIComponent(message)}`
}
