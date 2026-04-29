/* eslint-disable jsx-a11y/alt-text */
import ReactPDF, {
  Document,
  Page,
  Image,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
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

export function QuoteDocument({
  booking,
}: {
  booking: NonNullable<FindLeadBookingByIdType>
}) {
  const agencyLogoUrl = booking.agency.logoUrl
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
            <Text style={styles.h1}>QUOTATION</Text>
          </View>
        </View>
        <View id="bookingDetails" style={styles.bookingDetails}>
          <View id="Date" style={styles.detailsSection}>
            <Text style={styles.pBold}>Quote Date: </Text>
            <Text style={styles.p}>
              {booking.createdAt.toLocaleDateString()}
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
          {booking.remarks && (
            <View id="Remarks" style={styles.detailsSection}>
              <Text style={styles.pBold}>Remarks: </Text>
              <Text style={styles.p}>{booking.customer.remarks}</Text>
            </View>
          )}
          {booking.assignedVehicle && (
            <View id="Vehicle" style={styles.detailsSection}>
              <Text style={styles.pBold}>Assigned Vehicle: </Text>
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
              <Text style={styles.pBold}>Assigned Driver: </Text>
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
              -- {booking.citydistance} Km --
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
          <View id="tableFooter" style={styles.tableFooter}>
            <Text style={styles.pBold}>Estimated Amount</Text>
            <Text style={styles.pBold}>{booking.totalAmount.toFixed(2)}</Text>
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
            1. This quotation auto-generated on behalf of the aforementioned
            agency and is valid for 30 days from the date of issue.
          </Text>
          <Text style={styles.caption}>
            2. The assigned vehicle and driver is subject to availability and
            may change at the time of booking confirmation.
          </Text>
          <Text style={styles.caption}>
            3. The quoted price is based on the details provided and may change
            if there are any changes in the trip details or requirements.
          </Text>
          <Text style={styles.caption}>
            4. A final invoice will be provided at the end of the trip with the
            actual charges based on the services used and additional expenses
            incurred like fuel, parking or toll, etc.
          </Text>
          <Text style={styles.caption}>
            {
              "5. Cancellation and refund policies apply as per the agency's terms and conditions."
            }
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default async function getQuotePDF(
  bookingDetails: NonNullable<FindLeadBookingByIdType>,
) {
  return await ReactPDF.pdf(<QuoteDocument booking={bookingDetails} />).toBlob()
}
