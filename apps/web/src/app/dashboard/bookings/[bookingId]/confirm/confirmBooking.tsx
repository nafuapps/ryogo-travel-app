import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import Link from "next/link"
import moment from "moment"
import { format } from "date-fns"
import CancelBookingAlertButton from "@/components/buttons/alert/cancelBookingAlertButton"
import SendQuoteAlertButton from "@/components/buttons/alert/sendQuoteAlertButton"
import BookingItem from "@/components/flows/bookings/details/bookingItem"
import BookingSection from "@/components/flows/bookings/details/bookingSection"
import BookingPriceItem from "@/components/flows/bookings/details/bookingPriceItem"
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
import { PageWrapper } from "@/components/page/pageWrappers"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
// import LeadPDFViewer from "@/components/pdf/leadPDFViewer"

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
    <PageWrapper id="ConfirmBookingPage">
      <BookingGrid>
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
          <BookingStatusPill status={booking.status} />
          {isOwner && (
            <Link href={`/dashboard/bookings/${booking.id}/assign-user`}>
              <RyogoOutlineButton
                label={t("AssignAgent")}
                className={"w-full"}
              />
            </Link>
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
          <Link href={`/dashboard/customers/${booking.customer.id}`}>
            <RyogoOutlineButton
              label={t("ViewCustomerDetails")}
              className={"w-full"}
            />
          </Link>
          {(isOwner || isAssignedUser) && (
            <>
              <RyogoPhoneButton
                label={t("CallCustomer")}
                phone={booking.customer.phone}
              />
              <RyogoChatButton
                label={t("ChatCustomer")}
                phone={booking.customer.phone}
              />
            </>
          )}
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
          <Link href={`/dashboard/bookings/${booking.id}/assign-vehicle`}>
            <RyogoOutlineButton
              label={
                booking.assignedVehicle
                  ? t("ChangeVehicle")
                  : t("AssignVehicle")
              }
              className={"w-full"}
            />
          </Link>
          <BookingItem
            title={t("AssignedDriver")}
            value={booking.assignedDriver ? booking.assignedDriver.name : "-"}
          />
          <Link href={`/dashboard/bookings/${booking.id}/assign-driver`}>
            <RyogoOutlineButton
              label={
                booking.assignedDriver ? t("ChangeDriver") : t("AssignDriver")
              }
              className={"w-full"}
            />
          </Link>
        </BookingSection>
        <BookingSection sectionTitle={t("PriceInfo")} icon={ReceiptIndianRupee}>
          <BookingPriceItem
            title={t("VehicleCharge")}
            value={"₹" + booking.estimatedTotalVehicleRate}
            subtitle={t("RatePerKm", {
              rate: booking.ratePerKm,
              km: booking.estimatedTotalDistance,
            })}
          />
          <BookingPriceItem
            title={t("ACCharge")}
            value={"₹" + booking.estimatedTotalAcCharge}
            subtitle={t("ACPerDay", { charge: booking.acChargePerDay })}
          />
          <BookingPriceItem
            title={t("DriverAllowance")}
            value={"₹" + booking.estimatedTotalDriverAllowance}
            subtitle={t("AllowancePerDay", {
              allowance: booking.allowancePerDay,
            })}
          />
          <BookingPriceItem
            title={t("Commission")}
            value={"₹" + booking.estimatedCommissionAmount}
            subtitle={t("CommissionRate", { rate: booking.commissionRate })}
          />
          <BookingPriceItem
            title={t("TotalAmount")}
            value={"₹" + booking.estimatedTotalAmount}
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
      </BookingGrid>
    </PageWrapper>
  )
}
