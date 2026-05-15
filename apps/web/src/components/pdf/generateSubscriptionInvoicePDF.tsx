import ReactPDF, {
  Document,
  Page,
  Image,
  Text,
  View,
} from "@react-pdf/renderer"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { styles } from "./commonStyles"

//TODO: Invoice Document PDF
export function SubscriptionInvoiceDocument({}: {}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}></Page>
    </Document>
  )
}

export default async function getSubscriptionInvoicePDF() {
  return await ReactPDF.pdf(<SubscriptionInvoiceDocument />).toBlob()
}
