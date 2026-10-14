import ReactPDF, {
  Document,
  Page,
  Image,
  Text,
  View,
  Link,
} from "@react-pdf/renderer"
import { styles } from "./commonStyles"
import {
  HOMEPAGE_URL,
  RyogoLogoSrc,
  SUPPORT_EMAIL,
  SUPPORT_HELPLINE_NUMBER,
} from "@/lib/uiConfig"
import { format } from "date-fns"
import { ROIReportType } from "@ryogo-travel-app/api/types/agency.types"

function ROIReportDocument({ report }: { report: ROIReportType }) {
  console.log(report.monthlyWage)
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View id="header" style={styles.header} wrap={false}>
          <Image src={RyogoLogoSrc} style={styles.agencyLogo} />
          <View id="headerLeft" style={styles.headerLeft}>
            <Text id="CompanyName" style={styles.h2}>
              {"RyoGo Travel App"}
            </Text>
            <Text id="CompanyEmailPhone" style={styles.p}>
              {SUPPORT_EMAIL} | {SUPPORT_HELPLINE_NUMBER}
            </Text>
            <Link id="CompanyURL" style={styles.p}>
              {HOMEPAGE_URL}
            </Link>
          </View>
          <View id="headerRight" style={styles.headerRight}>
            <Text style={styles.h1}>MY ROI REPORT</Text>
            <Text style={styles.p}>{format(new Date(), "dd MMM yyyy")}</Text>
          </View>
        </View>
        <Text style={styles.p}>Hello,</Text>
        <Text style={styles.p}>
          Thank you for showing interest in RyoGo. This is a Return On
          Investment calculation report that will help you understand how much
          time and money you can save with our platform. The report is based on
          the details provided by you. Feel free to contact us if you have any
          queries.
        </Text>
        <View id="reportInputs" style={styles.bookingDetails} wrap={false}>
          <View id="Vehicles" style={styles.detailsSection}>
            <Text style={styles.pBold}>Fleet Vehicles: </Text>
            <Text style={styles.p}>{report.vehicles}</Text>
          </View>
          <View id="Bookings" style={styles.detailsSection}>
            <Text style={styles.pBold}>Monthly bookings completed: </Text>
            <Text style={styles.p}>{report.bookings}</Text>
          </View>
          <View id="Leads" style={styles.detailsSection}>
            <Text style={styles.pBold}>Monthly customer leads: </Text>
            <Text style={styles.p}>{report.leads}</Text>
          </View>
          <View id="TimeSpent" style={styles.detailsSection}>
            <Text style={styles.pBold}>Daily time spent on each booking: </Text>
            <Text style={styles.p}>{report.timeSpent} minutes</Text>
          </View>
          <View id="Wage" style={styles.detailsSection}>
            <Text style={styles.pBold}>Monthly wage per agent: </Text>
            <Text style={styles.p}>{report.monthlyWage}</Text>
          </View>
          <View id="Cost" style={styles.detailsSection}>
            <Text style={styles.pBold}>
              Monthly avoidable cost per vehicle:
            </Text>
            <Text style={styles.p}>{report.monthlyCost}</Text>
          </View>
          <View id="Leakage" style={styles.detailsSection}>
            <Text style={styles.pBold}>Revenue leakage per booking:</Text>
            <Text style={styles.p}>{report.bookingLeakage}</Text>
          </View>
          <View id="City" style={styles.detailsSection}>
            <Text style={styles.pBold}>City of operation:</Text>
            <Text style={styles.p}>{report.cityTier}</Text>
          </View>
        </View>
        <View id="outputTable" style={styles.pricingTable} wrap={false}>
          <View id="tableHeader" style={styles.tableHeader}>
            <Text style={styles.pBold}>Description</Text>
            <Text style={styles.pBold}>Value</Text>
          </View>
          <View id="timeHoursRow" style={styles.tableRow}>
            <Text style={styles.p}>Time saved every month</Text>
            <Text style={styles.p}>{report.monthlyTimeSavedHours} hours</Text>
          </View>
          <View id="timeValueRow" style={styles.tableRow}>
            <Text style={styles.p}>Time value savings</Text>
            <Text style={styles.p}>{report.totalTimeSavings}</Text>
          </View>
          <View id="vehicleSavingsRow" style={styles.tableRow}>
            <Text style={styles.p}>Vehicle cost savings</Text>
            <Text style={styles.p}>{report.totalSavingsVehicleCost}</Text>
          </View>
          <View id="leakageSavingsRow" style={styles.tableRow}>
            <Text style={styles.p}>Booking leakage savings</Text>
            <Text style={styles.p}>{report.totalSavingsBookingLeakages}</Text>
          </View>
          <View id="tableFooter" style={styles.tableFooter}>
            <Text style={styles.pBold}>Estimated Monthly Savings</Text>
            <Text style={styles.pBold}>{report.totalSavings}</Text>
          </View>
        </View>
        <View id="ROIDays" style={styles.borderContent}>
          <Text style={styles.p}>
            With RyoGo, you will recover your subscription cost in just:
          </Text>
          <Text style={styles.pBold}>{report.roiDays.toFixed(0)} days!</Text>
        </View>
        <View style={styles.divider} />
        <View id="terms" style={styles.terms} wrap={false}>
          <Text style={styles.pBold}>Terms and Conditions:</Text>
          <Text style={styles.caption}>
            1. This document is an auto-generated report based on the details
            provided you. It is not a contract or a legal document.
          </Text>
          <Text style={styles.caption}>
            2. The prices provided in this report are estimated and may be
            subject to change.
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

export default async function getROIReportPDF(report: ROIReportType) {
  return await ReactPDF.pdf(<ROIReportDocument report={report} />).toBlob()
}
