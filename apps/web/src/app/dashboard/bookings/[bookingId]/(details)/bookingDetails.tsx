import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import Link from "next/link"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import CancelBookingAlertButton from "@/components/buttons/alert/cancelBookingAlertButton"
import SendInvoiceAlertButton from "@/components/buttons/alert/sendInvoiceAlertButton"
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
  UserKey,
} from "lucide-react"
import SendConfirmationAlertButton from "@/components/buttons/alert/sendConfirmationAlertButton"
import { PageWrapper } from "@/components/page/pageWrappers"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
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
import BookingCreationInfoCard from "@/components/flows/bookings/details/bookingInfoCard"
import BookingReconcileCard from "@/components/flows/bookings/details/bookingReconcileCard"
import BookingIDWrapper from "@/components/flows/bookings/details/BookingIDWrapper"
import SendQuoteAlertButton from "@/components/buttons/alert/sendQuoteAlertButton"
import BookingRatingWrapper from "@/components/flows/bookings/details/bookingRatingCard"
import BookingViewInvoiceButton from "@/components/flows/bookings/details/bookingViewInvoiceButton"
import BookingViewQuoteButton from "@/components/flows/bookings/details/bookingViewQuoteButton"
import BookingViewConfirmationButton from "@/components/flows/bookings/details/bookingViewConfirmationButton"
// import LeadPDFViewer from "@/components/pdf/leadPDFViewer"

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

  const isLead = bookingDetails.status === BookingStatusEnum.LEAD
  const isConfirmed = bookingDetails.status === BookingStatusEnum.CONFIRMED
  const isInProgress = bookingDetails.status === BookingStatusEnum.IN_PROGRESS
  const isCompleted = bookingDetails.status === BookingStatusEnum.COMPLETED
  const isCancelled = bookingDetails.status === BookingStatusEnum.CANCELLED

  const canCancelBooking =
    (isOwner || isAssignedUser) && (isLead || isConfirmed)

  const canAssignVehicle =
    (isOwner || isAssignedUser) && (isLead || isConfirmed)
  const canAssignDriver = (isOwner || isAssignedUser) && (isLead || isConfirmed)

  const canAssignUser = isOwner && !isCompleted

  const canCommunicateWithCustomer = (isOwner || isAssignedUser) && !isCancelled

  const canSeeTripDetails = isConfirmed || isInProgress
  const canEditTripDetails = (isOwner || isAssignedUser) && isConfirmed

  const canConfirmBooking = (isOwner || isAssignedUser) && isLead

  const canViewQuote = (isOwner || isAssignedUser) && isCompleted
  const canViewConfirmation = (isOwner || isAssignedUser) && isConfirmed
  const canViewInvoice = (isOwner || isAssignedUser) && isCompleted

  const canReconcileBooking =
    isOwner && isCompleted && bookingDetails.reviewCompletedByAgencyAt

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
          <BookingIDWrapper
            id={bookingDetails.id}
            status={bookingDetails.status}
          />
          <BookingCreationInfoCard
            name={bookingDetails.bookedByUser.name}
            photoUrl={bookingDetails.bookedByUser.photoUrl}
            createdAt={bookingDetails.createdAt}
          />
          {isCompleted && (
            <BookingRatingWrapper
              ratingByCustomer={bookingDetails.ratingByCustomer}
              ratingByDriver={bookingDetails.ratingByDriver}
            />
          )}
          <BookingActionWrapper>
            {canConfirmBooking && (
              <Link href={`/dashboard/bookings/${bookingDetails.id}/confirm`}>
                <RyogoDetailedIconButton
                  label={t("ConfirmBooking.Title")}
                  icon={CalendarPlus}
                  subtitle={t("ConfirmBooking.Subtitle")}
                />
              </Link>
            )}
            {canReconcileBooking && (
              <BookingReconcileCard
                id={bookingDetails.id}
                reconciledAt={bookingDetails.reconciledAt}
              />
            )}
            {canCancelBooking && (
              <CancelBookingAlertButton
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                assignedUserId={bookingDetails.assignedUserId}
                isConfirmedBooking
              />
            )}
            {isCancelled && (
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
            //Only owner can click and see assigned user details page
            <Link href={`/dashboard/users/${bookingDetails.assignedUserId}`}>
              <BookingAssignedUserCard user={bookingDetails.assignedUser} />
            </Link>
          ) : (
            <BookingAssignedUserCard user={bookingDetails.assignedUser} />
          )}
          {canAssignUser && (
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
          {canCommunicateWithCustomer && (
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
          <BookingTripCard booking={bookingDetails} />
          {canSeeTripDetails && (
            <>
              <BookingStartTimeCard
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                userId={bookingDetails.assignedUserId}
                startTime={bookingDetails.startTime}
                canEdit={canEditTripDetails}
              />
              <BookingPickupAddressCard
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                userId={bookingDetails.assignedUserId}
                pickupAddress={bookingDetails.pickupAddress}
                customerAddress={bookingDetails.customer.address}
                canEdit={canEditTripDetails}
              />
              <BookingDropAddressCard
                bookingId={bookingDetails.id}
                agencyId={bookingDetails.agencyId}
                userId={bookingDetails.assignedUserId}
                dropAddress={bookingDetails.dropAddress}
                canEdit={canEditTripDetails}
              />
            </>
          )}
          <BookingRemarksCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            remarks={bookingDetails.remarks}
            canEdit={isOwner || isAssignedUser}
          />
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
          {canViewQuote && bookingDetails.quoteUrl && (
            <BookingViewQuoteButton bookingDetails={bookingDetails} />
          )}
          {canViewConfirmation && bookingDetails.confirmationUrl && (
            <BookingViewConfirmationButton bookingDetails={bookingDetails} />
          )}
          {canViewInvoice && bookingDetails.invoiceUrl && (
            <BookingViewInvoiceButton bookingDetails={bookingDetails} />
          )}
          {(isOwner || isAssignedUser) && (
            //Invoice can be sent for a completed and reviewed booking only
            <BookingActionWrapper>
              {isCompleted && (
                <>
                  {bookingDetails.reviewCompletedByAgencyAt ? (
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
                  )}
                </>
              )}
              {isConfirmed && (
                //Confirmation can be sent for a confirmed booking only
                <SendConfirmationAlertButton
                  bookingId={bookingDetails.id}
                  agencyId={bookingDetails.agencyId}
                  assignedUserId={bookingDetails.assignedUserId}
                  confirmationSentOn={bookingDetails.confirmationSentOn}
                />
              )}
              {isLead && (
                <SendQuoteAlertButton
                  bookingId={bookingDetails.id}
                  agencyId={bookingDetails.agencyId}
                  assignedUserId={bookingDetails.assignedUserId}
                  quoteSentOn={bookingDetails.quoteSentOn}
                />
              )}
            </BookingActionWrapper>
          )}
          {/* <LeadPDFViewer booking={booking} /> */}
        </BookingSection>
        <BookingSection sectionTitle={t("VehicleInfo")} icon={Car}>
          <BookingVehicleCard vehicle={bookingDetails.assignedVehicle} />
          {canAssignVehicle && (
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
        <BookingSection sectionTitle={t("DriverInfo")} icon={IdCard}>
          <BookingDriverCard driver={bookingDetails.assignedDriver} />
          {canAssignDriver && (
            <BookingActionWrapper>
              {bookingDetails.assignedDriver && (
                <>
                  <RyogoPhoneButton
                    label={t("CallDriver")}
                    phone={bookingDetails.assignedDriver.phone}
                  />
                  <RyogoChatButton
                    label={t("ChatDriver.Title")}
                    phone={bookingDetails.assignedDriver.phone}
                    subtitle={t("ChatDriver.Subtitle")}
                  />
                </>
              )}
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
            </BookingActionWrapper>
          )}
        </BookingSection>
      </BookingGrid>
    </PageWrapper>
  )
}
