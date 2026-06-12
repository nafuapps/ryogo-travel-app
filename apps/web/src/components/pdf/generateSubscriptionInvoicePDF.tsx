import ReactPDF, {
  Document,
  Page,
  Image,
  Text,
  View,
} from "@react-pdf/renderer"
import { styles } from "./commonStyles"
import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"
import { FindOrderByRPIdType } from "@ryogo-travel-app/api/services/order.services"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { GST_PERCENTAGE } from "@ryogo-travel-app/api/apiConfig"

export function SubscriptionInvoiceDocument({
  order,
  agency,
}: {
  order: NonNullable<FindOrderByRPIdType>
  agency: NonNullable<FindAgencyByIdType>
}) {
  const priceBeforeTax = (order.amount / (100 + GST_PERCENTAGE)) * 100
  const taxAmount = order.amount - priceBeforeTax

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View id="header" style={styles.header}>
          <Image src={"/logoPWA.png"} style={styles.agencyLogo} />
          <View id="headerLeft" style={styles.headerLeft}>
            <Text id="CompanyName" style={styles.h2}>
              {"RyoGo Travel App"}
            </Text>
            <Text id="CompanyPhone" style={styles.p}>
              {SUPPORT_HELPLINE_NUMBER}
            </Text>
            <Text id="CompanyEmail" style={styles.p}>
              {SUPPORT_EMAIL}
            </Text>
          </View>
          <View id="headerRight" style={styles.headerRight}>
            <Text style={styles.h1}>SUBSCRIPTION</Text>
            <Text style={styles.h1}>INVOICE</Text>
          </View>
        </View>
        <View id="buyerDetails" style={styles.bookingDetails}>
          <View id="Date" style={styles.detailsSection}>
            <Text style={styles.pBold}>Invoice Date: </Text>
            <Text style={styles.p}>{order.createdAt.toLocaleDateString()}</Text>
          </View>
          <View id="BookingID" style={styles.detailsSection}>
            <Text style={styles.pBold}>Invoice ID: </Text>
            <Text style={styles.p}>{"INV-" + order.id}</Text>
          </View>
          <View id="CustomerName" style={styles.detailsSection}>
            <Text style={styles.pBold}>Customer Name: </Text>
            <Text style={styles.p}>{agency.businessName}</Text>
          </View>
          <View id="CustomerPhone" style={styles.detailsSection}>
            <Text style={styles.pBold}>Phone: </Text>
            <Text style={styles.p}>{agency.businessPhone}</Text>
          </View>
          <View id="CustomerAddress" style={styles.detailsSection}>
            <Text style={styles.pBold}>Address: </Text>
            <Text style={styles.p}>{agency.businessAddress}</Text>
          </View>
        </View>
        <View id="pricingTable" style={styles.pricingTable}>
          <View id="tableHeader" style={styles.tableHeader}>
            <Text style={styles.pBold}>Description</Text>
            <Text style={styles.pBold}>Price</Text>
          </View>
          <View id="planRow" style={styles.tableRow}>
            <Text style={styles.p}>
              RyoGo {order.orderType.toUpperCase()} Subscription Plan
            </Text>
            <Text style={styles.p}>{priceBeforeTax.toFixed(2)}</Text>
          </View>
          <View id="taxRow" style={styles.tableRow}>
            <Text style={styles.p}>Tax ({GST_PERCENTAGE}%)</Text>
            <Text style={styles.p}>{taxAmount.toFixed(2)}</Text>
          </View>
          <View id="tableFooter" style={styles.tableFooter}>
            <Text style={styles.pBold}>Final Amount</Text>
            <Text style={styles.pBold}>{order.amount.toFixed(2)}</Text>
          </View>
        </View>
        <View id="terms" style={styles.terms}>
          <Text style={styles.pBold}>Terms and Conditions:</Text>
          <Text style={styles.caption}>
            1. This invoice is auto generated based on the payment made by the
            aforementioned customer.
          </Text>
          <Text style={styles.caption}>
            2. Subscription plan once started cannot be refunded or cancelled.
          </Text>
          <Text style={styles.caption}>
            3. For any related queries, please contact our customer support
            team.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default async function getSubscriptionInvoicePDF(
  order: NonNullable<FindOrderByRPIdType>,
  agency: NonNullable<FindAgencyByIdType>,
) {
  return await ReactPDF.pdf(
    <SubscriptionInvoiceDocument order={order} agency={agency} />,
  ).toBlob()
}
