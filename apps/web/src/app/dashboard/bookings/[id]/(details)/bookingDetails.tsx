import { linkClassName, pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "./bookingDetailHeaderTabs"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import moment from "moment"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import CancelBookingAlertButton from "@/app/dashboard/components/buttons/cancelBookingAlertButton"
import SendInvoiceAlertButton from "@/app/dashboard/components/buttons/sendInvoiceAlertButton"
import BookingItem from "@/app/dashboard/components/bookings/bookingItem"
import BookingPriceItem from "@/app/dashboard/components/bookings/bookingPriceItem"
import BookingSection from "@/app/dashboard/components/bookings/bookingSection"
import {
  BriefcaseBusiness,
  Contact,
  LifeBuoy,
  ReceiptIndianRupee,
  Route,
} from "lucide-react"
import SendConfirmationAlertButton from "@/app/dashboard/components/buttons/sendConfirmationAlertButton"
// import InvoicePDFViewer from "./invoicePDFViewer"

export default async function BookingDetailsPageComponent({
  bookingDetails,
  isOwner,
  isAssignedUser,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  isOwner: boolean
  isAssignedUser: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")

  return (
    <div id="BookingDetailsPage" className={pageClassName}>
      <BookingDetailHeaderTabs id={bookingDetails.id} selectedTab="Details" />
      <div
        id="BookingDetailsInfo"
        className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2"
      >
        <BookingSection
          sectionTitle={t("BookingInfo")}
          icon={BriefcaseBusiness}
        >
          <BookingItem
            title={t("Created")}
            value={format(bookingDetails.createdAt, "dd MMM hh:mm aaa")}
          />
          <BookingItem
            title={t("Status")}
            value={bookingDetails.status.toUpperCase()}
          />
          <BookingItem
            title={t("BookedBy")}
            value={bookingDetails.bookedByUser.name}
          />
          <BookingItem
            title={t("AssignedTo")}
            value={bookingDetails.assignedUser.name}
          />
          {isOwner && (
            <Button variant={"outline"}>
              <Link
                href={`/dashboard/bookings/${bookingDetails.id}/assign-user`}
                className={linkClassName}
              >
                {t("AssignAgent")}
              </Link>
            </Button>
          )}
          {(isOwner || isAssignedUser) && (
            <>
              {
                //Only owner can reconcile a completed booking
                bookingDetails.status === BookingStatusEnum.COMPLETED &&
                  !bookingDetails.isReconciled &&
                  isOwner && (
                    <Button variant={"default"}>
                      <Link
                        href={`/dashboard/bookings/${bookingDetails.id}/reconcile`}
                        className={linkClassName}
                      >
                        {t("Reconcile")}
                      </Link>
                    </Button>
                  )
              }
              {
                //Only confirmed booking can be cancelled here
                bookingDetails.status === BookingStatusEnum.CONFIRMED && (
                  <CancelBookingAlertButton
                    bookingId={bookingDetails.id}
                    agencyId={bookingDetails.agencyId}
                    assignedUserId={bookingDetails.assignedUserId}
                    notifyCustomer={true}
                  />
                )
              }
            </>
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("CustomerInfo")} icon={Contact}>
          <BookingItem
            title={t("CustomerName")}
            value={bookingDetails.customer.name}
          />
          <BookingItem
            title={t("CustomerLocation")}
            value={
              bookingDetails.customer.location.city +
              ", " +
              bookingDetails.customer.location.state
            }
          />
          <BookingItem
            title={t("CustomerPhone")}
            value={bookingDetails.customer.phone}
          />
          {bookingDetails.customer.address && (
            <BookingItem
              title={t("CustomerAddress")}
              value={bookingDetails.customer.address}
            />
          )}
          {bookingDetails.customer.remarks && (
            <BookingItem
              title={t("CustomerRemarks")}
              value={bookingDetails.customer.remarks}
            />
          )}
          <Button variant={"outline"}>
            <Link
              href={`/dashboard/customers/${bookingDetails.customer.id}`}
              className={linkClassName}
            >
              {t("ViewCustomerDetails")}
            </Link>
          </Button>
          {(isOwner || isAssignedUser) && (
            <Button variant={"secondary"}>
              <Link
                href={`tel:${bookingDetails.customer.phone}`}
                className={linkClassName}
              >
                {t("CallCustomer")}
              </Link>
            </Button>
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("TripInfo")} icon={Route}>
          <BookingItem
            title={t("From")}
            value={
              bookingDetails.source.city + ", " + bookingDetails.source.state
            }
          />
          <BookingItem
            title={t("To")}
            value={
              bookingDetails.destination.city +
              ", " +
              bookingDetails.destination.state
            }
          />
          <BookingItem
            title={t("StartDate")}
            value={moment(bookingDetails.startDate).format("DD MMM")}
          />
          <BookingItem
            title={t("EndDate")}
            value={moment(bookingDetails.endDate).format("DD MMM")}
          />
          <BookingItem
            title={t("Distance")}
            value={bookingDetails.citydistance + t("Km")}
          />
          <BookingItem
            title={t("Type")}
            value={bookingDetails.type.toUpperCase()}
          />
          <BookingItem
            title={t("Passengers")}
            value={bookingDetails.passengers.toString()}
          />
          <BookingItem
            title={t("NeedsAC")}
            value={bookingDetails.needsAc ? t("Yes") : t("No")}
          />
          {bookingDetails.pickupAddress && (
            <BookingItem
              title={t("PickupAddress")}
              value={bookingDetails.pickupAddress}
            />
          )}
          {bookingDetails.dropAddress && (
            <BookingItem
              title={t("DropAddress")}
              value={bookingDetails.dropAddress}
            />
          )}
          {bookingDetails.startTime && (
            <BookingItem
              title={t("StartTime")}
              value={moment(bookingDetails.startTime, "hh:mm:ss").format(
                "h:mm a",
              )}
            />
          )}
          {bookingDetails.remarks && (
            <BookingItem title={t("Remarks")} value={bookingDetails.remarks} />
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("AssignmentInfo")} icon={LifeBuoy}>
          <BookingItem
            title={t("AssignedVehicle")}
            value={
              bookingDetails.assignedVehicle
                ? bookingDetails.assignedVehicle.vehicleNumber
                : "-"
            }
          />
          {bookingDetails.status === BookingStatusEnum.CONFIRMED ? (
            <Button
              variant={bookingDetails.assignedVehicle ? "outline" : "default"}
            >
              <Link
                href={`/dashboard/bookings/${bookingDetails.id}/assign-vehicle`}
                className={linkClassName}
              >
                {bookingDetails.assignedVehicle
                  ? t("ChangeVehicle")
                  : t("AssignVehicle")}
              </Link>
            </Button>
          ) : (
            bookingDetails.assignedVehicle && (
              <Button variant={"outline"}>
                <Link
                  href={`/dashboard/vehicles/${bookingDetails.assignedVehicleId}`}
                  className={linkClassName}
                >
                  {t("ViewVehicleDetails")}
                </Link>
              </Button>
            )
          )}
          <BookingItem
            title={t("AssignDriver")}
            value={
              bookingDetails.assignedDriver
                ? bookingDetails.assignedDriver.name
                : "-"
            }
          />
          {bookingDetails.status === BookingStatusEnum.CONFIRMED ? (
            <Button
              variant={bookingDetails.assignedDriver ? "outline" : "default"}
            >
              <Link
                href={`/dashboard/bookings/${bookingDetails.id}/assign-driver`}
                className={linkClassName}
              >
                {bookingDetails.assignedDriver
                  ? t("ChangeDriver")
                  : t("AssignDriver")}
              </Link>
            </Button>
          ) : (
            bookingDetails.assignedDriver && (
              <Button variant={"outline"}>
                <Link
                  href={`/dashboard/drivers/${bookingDetails.assignedDriverId}`}
                  className={linkClassName}
                >
                  {t("ViewDriverDetails")}
                </Link>
              </Button>
            )
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("PriceInfo")} icon={ReceiptIndianRupee}>
          <BookingPriceItem
            title={t("VehicleCharge")}
            value={"₹" + bookingDetails.totalVehicleRate}
            subtitle={t("RatePerKm", {
              rate: bookingDetails.ratePerKm,
              km: bookingDetails.totalDistance,
            })}
          />
          {bookingDetails.totalAcCharge > 0 && (
            <BookingPriceItem
              title={t("ACCharge")}
              value={"₹" + bookingDetails.totalAcCharge}
              subtitle={t("ACPerDay", {
                charge: bookingDetails.acChargePerDay,
              })}
            />
          )}
          <BookingPriceItem
            title={t("DriverAllowance")}
            value={"₹" + bookingDetails.totalDriverAllowance}
            subtitle={t("AllowancePerDay", {
              allowance: bookingDetails.allowancePerDay,
            })}
          />
          <BookingPriceItem
            title={t("Commission")}
            value={"₹" + bookingDetails.totalCommission}
            subtitle={t("CommissionRate", {
              rate: bookingDetails.commissionRate,
            })}
          />
          <BookingPriceItem
            title={t("TotalAmount")}
            value={"₹" + bookingDetails.totalAmount}
          />
          {(isOwner || isAssignedUser) &&
            //Invoice can be sent for a completed booking only
            bookingDetails.status === BookingStatusEnum.COMPLETED && (
              <SendInvoiceAlertButton
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                assignedUserId={bookingDetails.assignedUserId}
                invoiceSentOn={bookingDetails.invoiceSentOn}
              />
            )}
          {(isOwner || isAssignedUser) &&
            //Confirmation can be sent for a confirmed booking only
            bookingDetails.status === BookingStatusEnum.CONFIRMED && (
              <SendConfirmationAlertButton
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                assignedUserId={bookingDetails.assignedUserId}
                confirmationSentOn={bookingDetails.confirmationSentOn}
              />
            )}
        </BookingSection>
        {/* <InvoicePDFViewer booking={bookingDetails} /> */}
      </div>
    </div>
  )
}
