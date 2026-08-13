import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import moment from "moment"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import CancelBookingAlertButton from "@/components/buttons/alert/cancelBookingAlertButton"
import SendInvoiceAlertButton from "@/components/buttons/alert/sendInvoiceAlertButton"
import BookingItem from "@/components/flows/bookings/details/bookingItem"
import BookingPriceItem from "@/components/flows/bookings/details/bookingPriceItem"
import BookingSection from "@/components/flows/bookings/details/bookingSection"
import {
  BriefcaseBusiness,
  Contact,
  LifeBuoy,
  ReceiptIndianRupee,
  Route,
} from "lucide-react"
import SendConfirmationAlertButton from "@/components/buttons/alert/sendConfirmationAlertButton"
import { PageWrapper } from "@/components/page/pageWrappers"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import { RyogoCaption } from "@/components/typography"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import ShareTrackBookingLinkButton from "@/components/buttons/track/shareTrackBookingLinkButton"

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
    <PageWrapper id="BookingDetailsPage">
      <BookingDetailHeaderTabs id={bookingDetails.id} selectedTab="Booking" />
      <BookingGrid>
        <BookingSection
          sectionTitle={t("BookingInfo")}
          icon={BriefcaseBusiness}
        >
          <BookingStatusPill status={bookingDetails.status} />
          <BookingItem
            title={t("Created")}
            value={format(bookingDetails.createdAt, "dd MMM hh:mm aaa")}
          />
          <BookingItem
            title={t("BookedBy")}
            value={bookingDetails.bookedByUser.name}
          />
          <BookingItem
            title={t("AssignedTo")}
            value={bookingDetails.assignedUser.name}
          />
          {bookingDetails.ratingByCustomer &&
            bookingDetails.status === BookingStatusEnum.COMPLETED && (
              <BookingItem
                title={t("CustomerRating")}
                value={bookingDetails.ratingByCustomer.toString()}
              />
            )}
          {bookingDetails.ratingByDriver &&
            bookingDetails.status === BookingStatusEnum.COMPLETED && (
              <BookingItem
                title={t("DriverRating")}
                value={bookingDetails.ratingByDriver.toString()}
              />
            )}
          {isOwner &&
            [
              BookingStatusEnum.CONFIRMED,
              BookingStatusEnum.IN_PROGRESS,
            ].includes(bookingDetails.status) && (
              <Button variant={"outline"}>
                <Link
                  href={`/dashboard/bookings/${bookingDetails.id}/assign-user`}
                  className={"w-full"}
                >
                  <RyogoCaption color="slate">{t("AssignAgent")}</RyogoCaption>
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
                        className={"w-full"}
                      >
                        <RyogoCaption color="white">
                          {t("Reconcile")}
                        </RyogoCaption>
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
                    isConfirmedBooking
                  />
                )
              }
              {/* {
                //Share cancel message link with customer over whatsapp for a cancelled booking
                bookingDetails.status === BookingStatusEnum.CANCELLED && (
                  <SendCancelMessageAlertButton
                    bookingId={bookingDetails.id}
                    phone={bookingDetails.customer.phone}
                    label={t("ShareCancelMessage")}
                  />)
              } */}
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
              className={"w-full"}
            >
              <RyogoCaption color="slate">
                {t("ViewCustomerDetails")}
              </RyogoCaption>
            </Link>
          </Button>
          {(isOwner || isAssignedUser) &&
            bookingDetails.status !== BookingStatusEnum.CANCELLED && (
              <>
                <RyogoPhoneButton
                  label={t("CallCustomer")}
                  phone={bookingDetails.customer.phone}
                />
                <RyogoChatButton
                  label={t("ChatCustomer")}
                  phone={bookingDetails.customer.phone}
                />
                {[
                  BookingStatusEnum.IN_PROGRESS,
                  BookingStatusEnum.COMPLETED,
                ].includes(bookingDetails.status) && (
                  <ShareTrackBookingLinkButton
                    bookingId={bookingDetails.id}
                    phone={bookingDetails.customer.phone}
                    label={t("ShareTrackingLink")}
                  />
                )}
              </>
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
                className={"w-full"}
              >
                <RyogoCaption
                  color={bookingDetails.assignedVehicle ? "light" : "white"}
                >
                  {bookingDetails.assignedVehicle
                    ? t("ChangeVehicle")
                    : t("AssignVehicle")}
                </RyogoCaption>
              </Link>
            </Button>
          ) : (
            bookingDetails.assignedVehicle && (
              <Button variant={"outline"}>
                <Link
                  href={`/dashboard/vehicles/${bookingDetails.assignedVehicleId}`}
                  className={"w-full"}
                >
                  <RyogoCaption color="slate">
                    {t("ViewVehicleDetails")}
                  </RyogoCaption>
                </Link>
              </Button>
            )
          )}
          <BookingItem
            title={t("AssignedDriver")}
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
                className={"w-full"}
              >
                <RyogoCaption
                  color={bookingDetails.assignedDriver ? "light" : "white"}
                >
                  {bookingDetails.assignedDriver
                    ? t("ChangeDriver")
                    : t("AssignDriver")}
                </RyogoCaption>
              </Link>
            </Button>
          ) : (
            bookingDetails.assignedDriver && (
              <Button variant={"outline"}>
                <Link
                  href={`/dashboard/drivers/${bookingDetails.assignedDriverId}`}
                  className={"w-full"}
                >
                  <RyogoCaption color="light">
                    {t("ViewDriverDetails")}
                  </RyogoCaption>
                </Link>
              </Button>
            )
          )}
          {bookingDetails.assignedDriver && (isOwner || isAssignedUser) && (
            <div className="flex flex-col gap-2 lg:gap-3 mt-auto">
              <RyogoPhoneButton
                label={t("CallDriver")}
                phone={bookingDetails.assignedDriver.phone}
              />
              <RyogoChatButton
                label={t("ChatDriver")}
                phone={bookingDetails.assignedDriver.phone}
              />
            </div>
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
      </BookingGrid>
    </PageWrapper>
  )
}
