/* eslint-disable jsx-a11y/alt-text */
import ReactPDF, {
  Document,
  Page,
  Image,
  Text,
  View,
} from "@react-pdf/renderer"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { styles } from "./commonStyles"

export function LeadQuoteDocument({
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
          <View id="PoweredBy" style={styles.powered}>
            <Text style={styles.caption}>Powered by RyoGo</Text>
            <Image src={"/logo.png"} style={styles.ryoGoLogo}></Image>
          </View>
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
            1. This quotation is auto-generated on behalf of the aforementioned
            agency and is valid for 30 days from the date of issue.
          </Text>
          <Text style={styles.caption}>
            2. The assigned vehicle and driver is subject to availability and
            may change at the time of booking confirmation.
          </Text>
          <Text style={styles.caption}>
            3. The prices quoted above are an estimate and are based on the
            details provided and may change if there are any changes in the trip
            details or requirements.
          </Text>
          <Text style={styles.caption}>
            4. A final invoice will be provided at the end of the trip with the
            actual charges based on the services used and additional expenses
            incurred like fuel, parking or toll, etc.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default async function getLeadQuotePDF(
  bookingDetails: NonNullable<FindLeadBookingByIdType>,
) {
  return await ReactPDF.pdf(
    <LeadQuoteDocument booking={bookingDetails} />,
  ).toBlob()
}
