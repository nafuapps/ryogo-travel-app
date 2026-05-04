import { linkClassName, pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import Link from "next/link"
import moment from "moment"
import { format } from "date-fns"
import CancelBookingAlertButton from "@/components/buttons/cancelBookingAlertButton"
import SendQuoteAlertButton from "@/components/buttons/sendQuoteAlertButton"
import BookingItem from "@/components/bookings/bookingItem"
import BookingSection from "@/components/bookings/bookingSection"
import BookingPriceItem from "@/components/bookings/bookingPriceItem"
import {
  BriefcaseBusiness,
  CalendarCheck,
  Contact,
  LifeBuoy,
  ReceiptIndianRupee,
  Route,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import ConfirmBookingForm from "./confirmBookingForm"
// import LeadPDFViewer from "./leadPDFViewer"

export default async function ConfirmBookingPageComponent({
  booking,
  isOwner,
  isAssignedUser,
}: {
  booking: NonNullable<FindLeadBookingByIdType>
  isOwner: boolean
  isAssignedUser: boolean
}) {
  const t = await getTranslations("Dashboard.ConfirmBooking")

  return (
    <div id="ConfirmBookingPage" className={pageClassName}>
      <div
        id="ConfirmBookingInfo"
        className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2"
      >
        <BookingSection
          sectionTitle={t("BookingInfo")}
          icon={BriefcaseBusiness}
        >
          <BookingItem title={t("BookingId")} value={booking.id} />
          <BookingItem
            title={t("Created")}
            value={format(booking.createdAt, "dd MMM hh:mm aaa")}
          />
          <BookingItem
            title={t("BookedBy")}
            value={booking.bookedByUser.name}
          />
          <BookingItem
            title={t("AssignedTo")}
            value={booking.assignedUser.name}
          />
          {isOwner && (
            <Button variant={"outline"}>
              <Link
                href={`/dashboard/bookings/${booking.id}/assign-user`}
                className={linkClassName}
              >
                {t("AssignAgent")}
              </Link>
            </Button>
          )}
          {(isOwner || isAssignedUser) && (
            <CancelBookingAlertButton
              bookingId={booking.id}
              agencyId={booking.agencyId}
              assignedUserId={booking.assignedUserId}
            />
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("ConfirmInfo")} icon={CalendarCheck}>
          <ConfirmBookingForm
            booking={booking}
            canConfirm={isOwner || isAssignedUser}
          />
        </BookingSection>
        <BookingSection sectionTitle={t("CustomerInfo")} icon={Contact}>
          <BookingItem
            title={t("CustomerName")}
            value={booking.customer.name}
          />
          <BookingItem
            title={t("CustomerLocation")}
            value={
              booking.customer.location.city +
              ", " +
              booking.customer.location.state
            }
          />
          <BookingItem
            title={t("CustomerPhone")}
            value={booking.customer.phone}
          />
          {booking.customer.address && (
            <BookingItem
              title={t("CustomerAddress")}
              value={booking.customer.address}
            />
          )}
          {booking.customer.remarks && (
            <BookingItem
              title={t("CustomerRemarks")}
              value={booking.customer.remarks}
            />
          )}
          <Button variant={"outline"}>
            <Link
              href={`/dashboard/customers/${booking.customer.id}`}
              className={linkClassName}
            >
              {t("ViewCustomerDetails")}
            </Link>
          </Button>
        </BookingSection>
        <BookingSection sectionTitle={t("TripInfo")} icon={Route}>
          <BookingItem
            title={t("From")}
            value={booking.source.city + ", " + booking.source.state}
          />
          <BookingItem
            title={t("To")}
            value={booking.destination.city + ", " + booking.destination.state}
          />
          <BookingItem
            title={t("StartDate")}
            value={moment(booking.startDate).format("DD MMM")}
          />
          <BookingItem
            title={t("EndDate")}
            value={moment(booking.endDate).format("DD MMM")}
          />
          <BookingItem
            title={t("Distance")}
            value={booking.citydistance + t("Km")}
          />
          <BookingItem title={t("Type")} value={booking.type.toUpperCase()} />
          <BookingItem
            title={t("Passengers")}
            value={booking.passengers.toString()}
          />
          <BookingItem
            title={t("NeedsAC")}
            value={booking.needsAc ? t("Yes") : t("No")}
          />
        </BookingSection>
        <BookingSection sectionTitle={t("AssignmentInfo")} icon={LifeBuoy}>
          <BookingItem
            title={t("AssignedVehicle")}
            value={
              booking.assignedVehicle
                ? booking.assignedVehicle.vehicleNumber
                : "-"
            }
          />
          <Button variant={booking.assignedVehicle ? "secondary" : "outline"}>
            <Link
              href={`/dashboard/bookings/${booking.id}/assign-vehicle`}
              className={linkClassName}
            >
              {booking.assignedVehicle
                ? t("ChangeVehicle")
                : t("AssignVehicle")}
            </Link>
          </Button>
          <BookingItem
            title={t("AssignedDriver")}
            value={booking.assignedDriver ? booking.assignedDriver.name : "-"}
          />
          <Button variant={booking.assignedDriver ? "secondary" : "outline"}>
            <Link
              href={`/dashboard/bookings/${booking.id}/assign-driver`}
              className={linkClassName}
            >
              {booking.assignedDriver ? t("ChangeDriver") : t("AssignDriver")}
            </Link>
          </Button>
        </BookingSection>
        <BookingSection sectionTitle={t("PriceInfo")} icon={ReceiptIndianRupee}>
          <BookingPriceItem
            title={t("VehicleCharge")}
            value={"₹" + booking.totalVehicleRate}
            subtitle={t("RatePerKm", {
              rate: booking.ratePerKm,
              km: booking.totalDistance,
            })}
          />
          <BookingPriceItem
            title={t("ACCharge")}
            value={"₹" + booking.totalAcCharge}
            subtitle={t("ACPerDay", { charge: booking.acChargePerDay })}
          />
          <BookingPriceItem
            title={t("DriverAllowance")}
            value={"₹" + booking.totalDriverAllowance}
            subtitle={t("AllowancePerDay", {
              allowance: booking.allowancePerDay,
            })}
          />
          <BookingPriceItem
            title={t("Commission")}
            value={"₹" + booking.totalCommission}
            subtitle={t("CommissionRate", { rate: booking.commissionRate })}
          />
          <BookingPriceItem
            title={t("TotalAmount")}
            value={"₹" + booking.totalAmount}
          />
          {(isOwner || isAssignedUser) && (
            <SendQuoteAlertButton
              bookingId={booking.id}
              agencyId={booking.agencyId}
              assignedUserId={booking.assignedUserId}
              quoteSentOn={booking.quoteSentOn}
            />
          )}
        </BookingSection>
        {/* <LeadPDFViewer booking={booking} /> */}
      </div>
    </div>
  )
}
