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
  ClipboardCopy,
  Contact,
  IdCard,
  ReceiptIndianRupee,
  Replace,
  Route,
  Scale,
  UserKey,
} from "lucide-react"
import SendConfirmationAlertButton from "@/components/buttons/alert/sendConfirmationAlertButton"
import { PageWrapper } from "@/components/page/pageWrappers"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import ShareTrackBookingLinkButton from "@/components/buttons/track/shareTrackBookingLinkButton"
import ReviewCompletedBookingAlertButton from "@/components/buttons/alert/reviewCompletedBookingAlertButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import BookingVehicleCard from "@/components/flows/bookings/details/bookingVehicleCard"
import BookingDriverCard from "@/components/flows/bookings/details/bookingDriverCard"
import BookingActionWrapper from "@/components/flows/bookings/details/bookingActionWrapper"
import BookingCustomerCard from "@/components/flows/bookings/details/bookingCustomerCard"
import BookingAssignedUserCard from "@/components/flows/bookings/details/bookingAssignedUserCard"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import BookingStartTimeCard from "@/components/flows/bookings/details/bookingStartTimeCard"
import BookingDropAddressCard from "@/components/flows/bookings/details/bookingDropAddressCard"
import BookingPickupAddressCard from "@/components/flows/bookings/details/bookingPickupAddressCard"
import BookingRemarksCard from "@/components/flows/bookings/details/bookingRemarksCard"

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
        <BookingSection sectionTitle={t("AssignedUserInfo")} icon={UserKey}>
          {isOwner ? (
            <Link href={`/dashboard/users/${bookingDetails.assignedUserId}`}>
              <BookingAssignedUserCard user={bookingDetails.assignedUser} />
            </Link>
          ) : (
            <BookingAssignedUserCard user={bookingDetails.assignedUser} />
          )}
          {isOwner &&
            [
              BookingStatusEnum.CONFIRMED,
              BookingStatusEnum.IN_PROGRESS,
            ].includes(bookingDetails.status) && (
              <BookingActionWrapper>
                {!isAssignedUser && (
                  <RyogoPhoneButton
                    label={t("CallAssignedUser")}
                    phone={bookingDetails.assignedUser.phone}
                  />
                )}
                <Link
                  href={`/dashboard/bookings/${bookingDetails.id}/assign-user`}
                >
                  <RyogoDetailedIconButton
                    label={t("AssignAgent.Title")}
                    icon={Replace}
                    subtitle={t("AssignAgent.Subtitle")}
                  />
                </Link>
              </BookingActionWrapper>
            )}
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
          <BookingTripCard {...bookingDetails} />
          <BookingStartTimeCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            startTime={bookingDetails.startTime}
            canEdit={
              (isOwner || isAssignedUser) &&
              bookingDetails.status === BookingStatusEnum.CONFIRMED
            }
          />
          <BookingPickupAddressCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            pickupAddress={bookingDetails.pickupAddress}
            customerAddress={bookingDetails.customer.address}
            canEdit={
              (isOwner || isAssignedUser) &&
              bookingDetails.status === BookingStatusEnum.CONFIRMED
            }
          />
          <BookingDropAddressCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            dropAddress={bookingDetails.dropAddress}
            canEdit={
              (isOwner || isAssignedUser) &&
              bookingDetails.status === BookingStatusEnum.CONFIRMED
            }
          />
          <BookingRemarksCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            remarks={bookingDetails.remarks}
            canEdit={isOwner || isAssignedUser}
          />
        </BookingSection>
        {(bookingDetails.assignedVehicle ||
          bookingDetails.status === BookingStatusEnum.CONFIRMED) && (
          <BookingSection sectionTitle={t("VehicleInfo")} icon={Car}>
            {bookingDetails.assignedVehicle && (
              <Link
                href={`/dashboard/vehicles/${bookingDetails.assignedVehicleId}`}
              >
                <BookingVehicleCard vehicle={bookingDetails.assignedVehicle} />
              </Link>
            )}
            {(isOwner || isAssignedUser) &&
              bookingDetails.status === BookingStatusEnum.CONFIRMED && (
                <BookingActionWrapper>
                  <Link
                    href={`/dashboard/bookings/${bookingDetails.id}/assign-vehicle`}
                  >
                    {bookingDetails.assignedVehicle ? (
                      <RyogoDetailedIconButton
                        label={t("ChangeVehicle.Title")}
                        icon={Replace}
                        subtitle={t("ChangeVehicle.Subtitle")}
                      />
                    ) : (
                      <RyogoDetailedIconButton
                        label={t("AssignVehicle.Title")}
                        icon={ClipboardCopy}
                        subtitle={t("AssignVehicle.Subtitle")}
                      />
                    )}
                  </Link>
                </BookingActionWrapper>
              )}
          </BookingSection>
        )}
        {(bookingDetails.assignedDriver ||
          bookingDetails.status === BookingStatusEnum.CONFIRMED) && (
          <BookingSection sectionTitle={t("DriverInfo")} icon={IdCard}>
            {bookingDetails.assignedDriver && (
              <Link
                href={`/dashboard/drivers/${bookingDetails.assignedDriverId}`}
              >
                <BookingDriverCard driver={bookingDetails.assignedDriver} />
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
                {bookingDetails.status === BookingStatusEnum.CONFIRMED && (
                  <Link
                    href={`/dashboard/bookings/${bookingDetails.id}/assign-driver`}
                  >
                    {bookingDetails.assignedDriver ? (
                      <RyogoDetailedIconButton
                        label={t("ChangeDriver.Title")}
                        icon={Replace}
                        subtitle={t("ChangeDriver.Subtitle")}
                      />
                    ) : (
                      <RyogoDetailedIconButton
                        label={t("AssignDriver.Title")}
                        icon={ClipboardCopy}
                        subtitle={t("AssignDriver.Subtitle")}
                      />
                    )}
                  </Link>
                )}
              </BookingActionWrapper>
            )}
          </BookingSection>
        )}
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
          {(isOwner || isAssignedUser) && (
            //Invoice can be sent for a completed and reviewed booking only
            <BookingActionWrapper>
              {bookingDetails.status === BookingStatusEnum.COMPLETED &&
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
              {bookingDetails.status === BookingStatusEnum.CONFIRMED && (
                //Confirmation can be sent for a confirmed booking only
                <SendConfirmationAlertButton
                  bookingId={bookingDetails.id}
                  agencyId={bookingDetails.agencyId}
                  assignedUserId={bookingDetails.assignedUserId}
                  confirmationSentOn={bookingDetails.confirmationSentOn}
                />
              )}
            </BookingActionWrapper>
          )}
          {/* <InvoicePDFViewer booking={bookingDetails} /> */}
        </BookingSection>
      </BookingGrid>
    </PageWrapper>
  )
}
