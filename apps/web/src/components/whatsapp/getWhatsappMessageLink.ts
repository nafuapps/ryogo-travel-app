export default function getWhatsappMessageLink(phone: string, message: string) {
  return `https://wa.me/91${phone}/?text=${encodeURIComponent(message)}`
}
