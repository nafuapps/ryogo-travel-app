/* eslint-disable jsx-a11y/alt-text */
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    gap: 20,
    padding: 32,
  },
  header: { flexDirection: "row", justifyContent: "space-between", gap: 4 },
  headerLeft: { flexDirection: "column", gap: 4 },
  agencyLogo: {
    height: 64,
    width: 64,
    objectFit: "contain",
  },
  headerRight: {
    flexDirection: "column",
    gap: 2,
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  bookingDetails: { flexDirection: "column", gap: 8 },
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  tripDetails: {
    flexDirection: "column",
  },
  tripLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
    gap: 16,
  },
  tripSource: {
    gap: 2,
  },
  tripDestination: {
    gap: 2,
    alignItems: "flex-end",
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    backgroundColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  pricingTable: {
    flexDirection: "column",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    border: "1px solid #ddd",
    backgroundColor: "#fff",
  },
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: "#ddd",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-end",
  },
  ryoGoLogo: {
    height: 40,
  },
  booked: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#ddd",
  },
  terms: {
    flexDirection: "column",
    gap: 2,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  p: {
    fontSize: 12,
  },
  pBold: {
    fontSize: 12,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 10,
  },
  captionLight: {
    fontSize: 10,
    fontWeight: "light",
    color: "#666",
  },
})

export function InvoiceDocument({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const agencyLogoUrl = booking.agency.logoUrl

  //Calculate expenses amount
  const expensesAmount = booking.expenses
    .filter((exp) => exp.isApproved)
    .reduce((acc, expense) => acc + expense.amount, 0)

  //Calculate final total amount for the invoice
  const totalAmount = booking.totalAmount + expensesAmount

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View id="header" style={styles.header}>
          {agencyLogoUrl && (
            <Image src={getFileUrl(agencyLogoUrl)} style={styles.agencyLogo} />
          )}
          <View id="headerLeft" style={styles.headerLeft}>
            <Text id="AgencyName" style={styles.h2}>
              {booking.agency.businessName}
            </Text>
            <Text id="AgencyAddress" style={styles.p}>
              {booking.agency.businessAddress}
            </Text>
            <Text id="AgencyPhoneEmail" style={styles.p}>
              {booking.agency.businessPhone} | {booking.agency.businessEmail}
            </Text>
          </View>
          <View id="headerRight" style={styles.headerRight}>
            <Text style={styles.h1}>BOOKING</Text>
            <Text style={styles.h1}>INVOICE</Text>
          </View>
        </View>
        <View id="bookingDetails" style={styles.bookingDetails}>
          <View id="Date" style={styles.detailsSection}>
            <Text style={styles.pBold}>Invoice Date: </Text>
            <Text style={styles.p}>
              {booking.updatedAt.toLocaleDateString()}
            </Text>
          </View>
          <View id="BookingID" style={styles.detailsSection}>
            <Text style={styles.pBold}>Booking ID: </Text>
            <Text style={styles.p}>{booking.id}</Text>
          </View>
          <View id="CustomerName" style={styles.detailsSection}>
            <Text style={styles.pBold}>Customer Name: </Text>
            <Text style={styles.p}>{booking.customer.name}</Text>
          </View>
          <View id="CustomerPhone" style={styles.detailsSection}>
            <Text style={styles.pBold}>Phone: </Text>
            <Text style={styles.p}>{booking.customer.phone}</Text>
          </View>
          <View id="CustomerAddress" style={styles.detailsSection}>
            <Text style={styles.pBold}>Address: </Text>
            <Text style={styles.p}>
              {booking.customer.location.city +
                ", " +
                booking.customer.location.state}
            </Text>
          </View>
          {booking.assignedVehicle && (
            <View id="Vehicle" style={styles.detailsSection}>
              <Text style={styles.pBold}>Vehicle: </Text>
              <View style={styles.tripDestination}>
                <Text style={styles.p}>
                  {booking.assignedVehicle.vehicleNumber}
                </Text>
                <Text style={styles.p}>
                  {booking.assignedVehicle.brand +
                    " " +
                    booking.assignedVehicle.model}
                </Text>
              </View>
            </View>
          )}
          {booking.assignedDriver && (
            <View id="Driver" style={styles.detailsSection}>
              <Text style={styles.pBold}>Driver: </Text>
              <View style={styles.tripDestination}>
                <Text style={styles.p}>{booking.assignedDriver.name}</Text>
                <Text style={styles.p}>{booking.assignedDriver.phone}</Text>
              </View>
            </View>
          )}
        </View>
        <View id="TripDetails" style={styles.tripDetails}>
          <View id="TripHeader" style={styles.tripLocation}>
            <View id="From" style={styles.tripSource}>
              <Text style={styles.h2}>{booking.source.city}</Text>
              <Text style={styles.p}>{booking.source.state}</Text>
            </View>
            <Text style={styles.captionLight}>
              -- {booking.totalDistance} Km --
            </Text>
            <View id="To" style={styles.tripDestination}>
              <Text style={styles.h2}>{booking.destination.city}</Text>
              <Text style={styles.p}>{booking.destination.state}</Text>
            </View>
          </View>
          <View id="TripFooter" style={styles.tripFooter}>
            <Text style={styles.p}>
              {booking.startDate.toLocaleDateString()}
            </Text>
            <Text style={styles.caption}>{booking.type.toUpperCase()}</Text>
            <Text style={styles.caption}>
              {booking.passengers.toString() + " pax"}
            </Text>
            <Text style={styles.p}>{booking.endDate.toLocaleDateString()}</Text>
          </View>
        </View>
        <View id="pricingTable" style={styles.pricingTable}>
          <View id="tableHeader" style={styles.tableHeader}>
            <Text style={styles.pBold}>Description</Text>
            <Text style={styles.pBold}>Price</Text>
          </View>
          <View id="vehicleRow" style={styles.tableRow}>
            <Text style={styles.p}>Vehicle Charge</Text>
            <Text style={styles.p}>{booking.totalVehicleRate.toFixed(2)}</Text>
          </View>
          <View id="driverRow" style={styles.tableRow}>
            <Text style={styles.p}>Driver Allowance</Text>
            <Text style={styles.p}>
              {booking.totalDriverAllowance.toFixed(2)}
            </Text>
          </View>
          <View id="acRow" style={styles.tableRow}>
            <Text style={styles.p}>AC Charge</Text>
            <Text style={styles.p}>{booking.totalAcCharge.toFixed(2)}</Text>
          </View>
          <View id="commissionRow" style={styles.tableRow}>
            <Text style={styles.p}>Service charge</Text>
            <Text style={styles.p}>{booking.totalCommission.toFixed(2)}</Text>
          </View>
          <View id="ExpensesRow" style={styles.tableRow}>
            <Text style={styles.p}>Trip Expenses</Text>
            <Text style={styles.p}>{expensesAmount.toFixed(2)}</Text>
          </View>
          <View id="tableFooter" style={styles.tableFooter}>
            <Text style={styles.pBold}>Final Amount</Text>
            <Text style={styles.pBold}>{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
        <View id="footer" style={styles.footer}>
          <Image src={"/logo.png"} style={styles.ryoGoLogo}></Image>
          <View id="BookedBy" style={styles.booked}>
            <Text style={styles.pBold}>{booking.assignedUser.name}</Text>
            <Text style={styles.p}>{booking.assignedUser.phone}</Text>
            <Text style={styles.caption}>
              {booking.assignedUser.userRole.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View id="terms" style={styles.terms}>
          <Text style={styles.pBold}>Terms and Conditions:</Text>
          <Text style={styles.caption}>
            1. This invoice is auto generated based on the booking details
            provided by the aforementioned agency.
          </Text>
          <Text style={styles.caption}>
            2. For any invoice related queries, please contact the agency.
          </Text>
          <Text style={styles.caption}>
            {
              "3. Cancellation and refund policies apply as per the agency's terms and conditions."
            }
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default async function getInvoicePDF(
  bookingDetails: NonNullable<FindBookingDetailsByIdType>,
) {
  return await ReactPDF.pdf(
    <InvoiceDocument booking={bookingDetails} />,
  ).toBlob()
}
