import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "./bookingDetailHeaderTabs"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import moment from "moment"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

import CancelBookingAlertButton from "@/app/dashboard/components/buttons/cancelBookingAlertButton"
import SendInvoiceAlertButton from "@/app/dashboard/components/buttons/sendInvoiceAlertButton"
import BookingItem from "@/app/dashboard/components/bookings/bookingItem"
import BookingPriceItem from "@/app/dashboard/components/bookings/bookingPriceItem"
import BookingSection from "@/app/dashboard/components/bookings/bookingSection"

export default async function BookingDetailsPageComponent({
  bookingId,
  bookingDetails,
  isOwner,
  isAssignedUser,
}: {
  bookingId: string
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  isOwner: boolean
  isAssignedUser: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")

  return (
    <div id="BookingDetailsPage" className={pageClassName}>
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Details" />
      <div
        id="BookingDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <BookingSection sectionTitle={t("BookingInfo")}>
          <BookingItem title={t("BookingId")} value={bookingDetails.id} />
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
            <Button
              variant={"secondary"}
              className="sm:col-span-2 xl:col-span-3"
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-user`}
                className="w-full"
              >
                {t("AssignAgent")}
              </Link>
            </Button>
          )}
        </BookingSection>
        <Separator />
        <BookingSection sectionTitle={t("CustomerInfo")}>
          <Link
            href={`/dashboard/customers/${bookingDetails.customer.id}`}
            className="hover:underline"
          >
            <BookingItem
              title={t("CustomerName")}
              value={bookingDetails.customer.name}
            />
          </Link>
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
          {(isOwner || isAssignedUser) && (
            <Button
              variant={"secondary"}
              className="sm:col-span-2 xl:col-span-3"
            >
              <Link
                href={`tel:${bookingDetails.customer.phone}`}
                className="w-full"
              >
                {t("CallCustomer")}
              </Link>
            </Button>
          )}
        </BookingSection>
        <Separator />
        <BookingSection sectionTitle={t("TripInfo")}>
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
              value={bookingDetails.pickupAddress!}
            />
          )}
          {bookingDetails.dropAddress && (
            <BookingItem
              title={t("DropAddress")}
              value={bookingDetails.dropAddress!}
            />
          )}
          {bookingDetails.startTime && (
            <BookingItem
              title={t("StartTime")}
              value={moment(bookingDetails.startTime!, "hh:mm:ss").format(
                "h:mm a",
              )}
            />
          )}
          {bookingDetails.remarks && (
            <BookingItem title={t("Remarks")} value={bookingDetails.remarks!} />
          )}
        </BookingSection>
        <Separator />
        <BookingSection sectionTitle={t("AssignmentInfo")}>
          {bookingDetails.assignedVehicle ? (
            <Link
              href={`/dashboard/vehicles/${bookingDetails.assignedVehicle.id}`}
              className="hover:underline"
            >
              <BookingItem
                title={t("AssignedVehicle")}
                value={bookingDetails.assignedVehicle.vehicleNumber}
              />
            </Link>
          ) : (
            <BookingItem title={t("AssignedVehicle")} value={"-"} />
          )}
          {bookingDetails.status == BookingStatusEnum.CONFIRMED && (
            <Button
              variant={
                bookingDetails.assignedVehicle?.vehicleNumber
                  ? "secondary"
                  : "default"
              }
              className="xl:col-span-3"
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-vehicle`}
                className="w-full"
              >
                {bookingDetails.assignedVehicle
                  ? t("ChangeVehicle")
                  : t("AssignVehicle")}
              </Link>
            </Button>
          )}
          {bookingDetails.assignedDriver ? (
            <Link
              href={`/dashboard/drivers/${bookingDetails.assignedDriver.id}`}
              className="hover:underline"
            >
              <BookingItem
                title={t("AssignedVehicle")}
                value={bookingDetails.assignedDriver.name}
              />
            </Link>
          ) : (
            <BookingItem title={t("AssignedDriver")} value={"-"} />
          )}
          {bookingDetails.status == BookingStatusEnum.CONFIRMED && (
            <Button
              variant={
                bookingDetails.assignedDriver?.name ? "secondary" : "default"
              }
              className="xl:col-span-3"
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-driver`}
                className="w-full"
              >
                {bookingDetails.assignedDriver
                  ? t("ChangeDriver")
                  : t("AssignDriver")}
              </Link>
            </Button>
          )}
        </BookingSection>
        <Separator />
        <BookingSection sectionTitle={t("PriceInfo")}>
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
        </BookingSection>
        {(isOwner || isAssignedUser) && (
          <div className="flex flex-col gap-3 lg:gap-4">
            {
              //Only owner can reconcile a completed booking
              bookingDetails.status == BookingStatusEnum.COMPLETED &&
                !bookingDetails.isReconciled &&
                isOwner && (
                  <Link href={`/dashboard/bookings/${bookingId}/reconcile`}>
                    <Button variant={"default"} className="w-full">
                      {t("Reconcile")}
                    </Button>
                  </Link>
                )
            }
            {
              //Invoice can be sent for a completed booking only
              bookingDetails.status == BookingStatusEnum.COMPLETED && (
                <SendInvoiceAlertButton bookingId={bookingId} />
              )
            }
            {
              //Only confirmed booking can be cancelled here
              bookingDetails.status == BookingStatusEnum.CONFIRMED && (
                <CancelBookingAlertButton bookingId={bookingId} />
              )
            }
          </div>
        )}
      </div>
    </div>
  )
}
