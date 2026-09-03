import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { format } from "date-fns"
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
  CalendarPlus,
  Car,
  Contact,
  IdCard,
  LifeBuoy,
  ReceiptIndianRupee,
  Route,
  Scale,
  UserRoundArrowLeft,
} from "lucide-react"
import SendConfirmationAlertButton from "@/components/buttons/alert/sendConfirmationAlertButton"
import { PageWrapper } from "@/components/page/pageWrappers"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import ShareTrackBookingLinkButton from "@/components/buttons/track/shareTrackBookingLinkButton"
import ReviewCompletedBookingAlertButton from "@/components/buttons/alert/reviewCompletedBookingAlertButton"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { Separator } from "@/components/ui/separator"
import BookingVehicleCard from "@/components/flows/bookings/details/bookingVehicleCard"
import { RyogoCaption } from "@/components/typography"
import BookingDriverCard from "@/components/flows/bookings/details/bookingDriverCard"
import BookingActionWrapper from "@/components/flows/bookings/details/bookingActionWrapper"
import BookingCustomerCard from "@/components/flows/bookings/details/bookingCustomerCard"

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

  const isCompleted = bookingDetails.status === BookingStatusEnum.COMPLETED
  const totalDistance =
    isCompleted && bookingDetails.actualTotalDistance
      ? bookingDetails.actualTotalDistance
      : bookingDetails.estimatedTotalDistance
  const totalVehicleCharge =
    isCompleted && bookingDetails.actualTotalVehicleRate
      ? bookingDetails.actualTotalVehicleRate
      : bookingDetails.estimatedTotalVehicleRate
  const totalDriverAllowance =
    isCompleted && bookingDetails.actualTotalDriverAllowance
      ? bookingDetails.actualTotalDriverAllowance
      : bookingDetails.estimatedTotalDriverAllowance
  const totalCommission =
    isCompleted && bookingDetails.actualCommissionAmount
      ? bookingDetails.actualCommissionAmount
      : bookingDetails.estimatedCommissionAmount
  const totalAcCharge =
    isCompleted && bookingDetails.actualTotalAcCharge
      ? bookingDetails.actualTotalAcCharge
      : bookingDetails.estimatedTotalAcCharge
  const totalAmount =
    isCompleted && bookingDetails.actualTotalAmount
      ? bookingDetails.actualTotalAmount
      : bookingDetails.estimatedTotalAmount

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
          <BookingActionWrapper>
            {isOwner &&
              //Only owner can reassign user to a booking
              [
                BookingStatusEnum.CONFIRMED,
                BookingStatusEnum.IN_PROGRESS,
              ].includes(bookingDetails.status) && (
                <Link
                  href={`/dashboard/bookings/${bookingDetails.id}/assign-user`}
                >
                  <RyogoDetailedIconButton
                    label={t("AssignAgent.Title")}
                    icon={UserRoundArrowLeft}
                    subtitle={t("AssignAgent.Subtitle")}
                  />
                </Link>
              )}
            {isOwner &&
              //Only owner can reconcile a completed and reviewed booking
              bookingDetails.status === BookingStatusEnum.COMPLETED &&
              bookingDetails.reviewCompletedByAgencyAt &&
              !bookingDetails.isReconciled && (
                <Link
                  href={`/dashboard/bookings/${bookingDetails.id}/reconcile`}
                >
                  <RyogoDetailedIconButton
                    label={t("Reconcile.Title")}
                    icon={Scale}
                    subtitle={t("Reconcile.Subtitle")}
                  />
                </Link>
              )}
            {(isOwner || isAssignedUser) &&
              //Only confirmed booking can be cancelled
              bookingDetails.status === BookingStatusEnum.CONFIRMED && (
                <CancelBookingAlertButton
                  bookingId={bookingDetails.id}
                  agencyId={bookingDetails.agencyId}
                  assignedUserId={bookingDetails.assignedUserId}
                  isConfirmedBooking
                />
              )}
            {bookingDetails.status === BookingStatusEnum.CANCELLED && (
              <Link
                href={`/dashboard/bookings/new/${bookingDetails.customerId}`}
              >
                <RyogoDetailedIconButton
                  label={t("CreateAnotherBooking.Title")}
                  icon={CalendarPlus}
                  subtitle={t("CreateAnotherBooking.Subtitle")}
                />
              </Link>
            )}
          </BookingActionWrapper>
        </BookingSection>
        <BookingSection sectionTitle={t("CustomerInfo")} icon={Contact}>
          <Link href={`/dashboard/customers/${bookingDetails.customer.id}`}>
            <BookingCustomerCard customer={bookingDetails.customer} />
          </Link>
          {(isOwner || isAssignedUser) &&
            bookingDetails.status !== BookingStatusEnum.CANCELLED && (
              <BookingActionWrapper>
                <RyogoPhoneButton
                  label={t("CallCustomer")}
                  phone={bookingDetails.customer.phone}
                />
                <RyogoChatButton
                  label={t("ChatCustomer.Title")}
                  phone={bookingDetails.customer.phone}
                  subtitle={t("ChatCustomer.Subtitle")}
                />
                <ShareTrackBookingLinkButton
                  bookingId={bookingDetails.id}
                  phone={bookingDetails.customer.phone}
                  label={t("ShareTrackingLink.Title")}
                  subtitle={t("ShareTrackingLink.Subtitle")}
                />
              </BookingActionWrapper>
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
          <RyogoCaption color="light">{t("AssignedVehicle")}</RyogoCaption>
          {bookingDetails.assignedVehicle && (
            <Link
              href={`/dashboard/vehicles/${bookingDetails.assignedVehicleId}`}
            >
              <BookingVehicleCard vehicle={bookingDetails.assignedVehicle} />
            </Link>
          )}
          {bookingDetails.status === BookingStatusEnum.CONFIRMED && (
            <Link
              href={`/dashboard/bookings/${bookingDetails.id}/assign-vehicle`}
            >
              {bookingDetails.assignedVehicle ? (
                <RyogoOutlineButton
                  label={t("ChangeVehicle")}
                  className={"w-full"}
                />
              ) : (
                <RyogoDetailedIconButton
                  label={t("AssignVehicle.Title")}
                  icon={Car}
                  subtitle={t("AssignVehicle.Subtitle")}
                />
              )}
            </Link>
          )}
          <Separator />
          <RyogoCaption color="light">{t("AssignedDriver")}</RyogoCaption>
          {bookingDetails.assignedDriver && (
            <Link
              href={`/dashboard/drivers/${bookingDetails.assignedDriverId}`}
            >
              <BookingDriverCard driver={bookingDetails.assignedDriver} />
            </Link>
          )}
          {bookingDetails.status === BookingStatusEnum.CONFIRMED && (
            <Link
              href={`/dashboard/bookings/${bookingDetails.id}/assign-driver`}
            >
              {bookingDetails.assignedDriver ? (
                <RyogoOutlineButton
                  label={t("ChangeDriver")}
                  className={"w-full"}
                />
              ) : (
                <RyogoDetailedIconButton
                  label={t("AssignDriver.Title")}
                  icon={IdCard}
                  subtitle={t("AssignDriver.Subtitle")}
                />
              )}
            </Link>
          )}
          {bookingDetails.assignedDriver && (isOwner || isAssignedUser) && (
            <BookingActionWrapper>
              <RyogoPhoneButton
                label={t("CallDriver")}
                phone={bookingDetails.assignedDriver.phone}
              />
              <RyogoChatButton
                label={t("ChatDriver.Title")}
                phone={bookingDetails.assignedDriver.phone}
                subtitle={t("ChatDriver.Subtitle")}
              />
            </BookingActionWrapper>
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("PriceInfo")} icon={ReceiptIndianRupee}>
          <BookingPriceItem
            title={t("VehicleCharge")}
            value={"₹" + totalVehicleCharge}
            subtitle={t("RatePerKm", {
              rate: bookingDetails.ratePerKm,
              km: totalDistance,
            })}
          />
          {totalAcCharge > 0 && (
            <BookingPriceItem
              title={t("ACCharge")}
              value={"₹" + totalAcCharge}
              subtitle={t("ACPerDay", {
                charge: bookingDetails.acChargePerDay,
              })}
            />
          )}
          <BookingPriceItem
            title={t("DriverAllowance")}
            value={"₹" + totalDriverAllowance}
            subtitle={t("AllowancePerDay", {
              allowance: bookingDetails.allowancePerDay,
            })}
          />
          <BookingPriceItem
            title={t("Commission")}
            value={"₹" + totalCommission}
            subtitle={t("CommissionRate", {
              rate: bookingDetails.commissionRate,
            })}
          />
          <BookingPriceItem
            title={t("TotalAmount")}
            value={"₹" + totalAmount}
          />
          {(isOwner || isAssignedUser) &&
            //Invoice can be sent for a completed and reviewed booking only
            bookingDetails.status === BookingStatusEnum.COMPLETED &&
            (bookingDetails.reviewCompletedByAgencyAt ? (
              <SendInvoiceAlertButton
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                assignedUserId={bookingDetails.assignedUserId}
                invoiceSentOn={bookingDetails.invoiceSentOn}
              />
            ) : (
              <ReviewCompletedBookingAlertButton
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                assignedUserId={bookingDetails.assignedUserId}
              />
            ))}
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
