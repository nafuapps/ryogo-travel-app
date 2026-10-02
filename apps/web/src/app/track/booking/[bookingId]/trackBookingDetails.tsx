import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import BookingActionWrapper from "@/components/flows/bookings/details/bookingActionWrapper"
import BookingAssignedUserCard from "@/components/flows/bookings/details/bookingAssignedUserCard"
import BookingCustomerCard from "@/components/flows/bookings/details/bookingCustomerCard"
import BookingDropAddressCard from "@/components/flows/bookings/details/bookingDropAddressCard"
import BookingGrid from "@/components/flows/bookings/details/bookingGrid"
import BookingIDWrapper from "@/components/flows/bookings/details/bookingIDWrapper"
import BookingPickupAddressCard from "@/components/flows/bookings/details/bookingPickupAddressCard"
import BookingPriceItem from "@/components/flows/bookings/details/bookingPriceItem"
import BookingRatingWrapper from "@/components/flows/bookings/details/bookingRatingCard"
import BookingRemarksCard from "@/components/flows/bookings/details/bookingRemarksCard"
import BookingRouteMapCard from "@/components/flows/bookings/details/bookingRouteMapCard"
import BookingSection from "@/components/flows/bookings/details/bookingSection"
import BookingStartTimeCard from "@/components/flows/bookings/details/bookingStartTimeCard"
import BookingTripCard from "@/components/flows/bookings/details/bookingTripCard"
import BookingVehicleCard from "@/components/flows/bookings/details/bookingVehicleCard"
import BookingViewConfirmationButton from "@/components/flows/bookings/details/bookingViewConfirmationButton"
import BookingViewInvoiceButton from "@/components/flows/bookings/details/bookingViewInvoiceButton"
import {
  PageWrapper,
  SectionRowWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  TransactionPartiesEnum,
  TransactionTypesEnum,
} from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import {
  BriefcaseBusiness,
  Car,
  Contact,
  IdCard,
  MapIcon,
  ReceiptIndianRupee,
  Route,
  UserKey,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import BookingDriverCard from "@/components/flows/bookings/details/bookingDriverCard"
import RateBookingByCustomerDialog from "@/components/flows/bookings/track/rateBookingByCustomerDialog"
import BookingAgencyCard from "@/components/flows/bookings/details/bookingAgencyCard"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import Link from "next/link"

// A page to display booking details for tracking by customer
export default async function TrackBookingDetailsPageComponent({
  bookingDetails,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.BookingDetails")

  const isConfirmed = bookingDetails.status === BookingStatusEnum.CONFIRMED
  const isInProgress = bookingDetails.status === BookingStatusEnum.IN_PROGRESS
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

  const receivedAmount = bookingDetails.transactions
    .filter((txn) => txn.otherParty === TransactionPartiesEnum.CUSTOMER)
    .reduce((total, txn) => {
      if (txn.type === TransactionTypesEnum.CREDIT) {
        return total + txn.amount
      } else {
        return total - txn.amount
      }
    }, 0)
  const pendingAmount = totalAmount - receivedAmount

  return (
    <PageWrapper id="TrackBookingDetailsPage">
      <BookingGrid>
        <BookingSection
          sectionTitle={t("BookingInfo")}
          icon={BriefcaseBusiness}
        >
          <BookingIDWrapper
            id={bookingDetails.id}
            status={bookingDetails.status}
          />
          <BookingAgencyCard agency={bookingDetails.agency} />
          {isCompleted && (
            <BookingRatingWrapper
              ratingByCustomer={bookingDetails.ratingByCustomer}
              ratingByDriver={bookingDetails.ratingByDriver}
            />
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("TripInfo")} icon={Route}>
          <BookingTripCard {...bookingDetails} />
          <BookingStartTimeCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            startTime={bookingDetails.startTime}
            canEdit={false}
          />
          <BookingPickupAddressCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            pickupAddress={bookingDetails.pickupAddress}
            customerAddress={bookingDetails.customer.address}
            canEdit={false}
          />
          <BookingDropAddressCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            dropAddress={bookingDetails.dropAddress}
            canEdit={false}
          />

          <BookingRemarksCard
            bookingId={bookingDetails.id}
            agencyId={bookingDetails.agencyId}
            userId={bookingDetails.assignedUserId}
            remarks={bookingDetails.remarks}
            canEdit={false}
          />
        </BookingSection>
        {bookingDetails.source.latLong &&
          bookingDetails.destination.latLong && (
            <BookingSection sectionTitle={t("MapInfo")} icon={MapIcon}>
              <BookingRouteMapCard
                source={bookingDetails.source.latLong}
                destination={bookingDetails.destination.latLong}
                updatedAt={bookingDetails.updatedAt}
                tripLogs={bookingDetails.tripLogs}
              />
            </BookingSection>
          )}
        <BookingSection sectionTitle={t("AssignedUserInfo")} icon={UserKey}>
          <BookingAssignedUserCard user={bookingDetails.assignedUser} />
          <BookingActionWrapper>
            <RyogoPhoneButton
              label={t("CallAssignedUser")}
              phone={bookingDetails.assignedUser.phone}
            />
            <RyogoChatButton
              label={t("ChatAssignedUser.Title")}
              phone={bookingDetails.assignedUser.phone}
              subtitle={t("ChatAssignedUser.Subtitle")}
            />
          </BookingActionWrapper>
        </BookingSection>
        <BookingSection sectionTitle={t("CustomerInfo")} icon={Contact}>
          <BookingCustomerCard customer={bookingDetails.customer} />
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
          {bookingDetails.actualExpensesAmount &&
            bookingDetails.reviewCompletedByAgencyAt && (
              <BookingPriceItem
                title={t("ActualExpenses")}
                value={"₹" + bookingDetails.actualExpensesAmount}
              />
            )}
          <Separator />
          <BookingPriceItem
            title={t("TotalAmount")}
            value={"₹" + totalAmount}
          />
          <SectionRowWrapper
            small
            className="w-full items-center justify-between"
          >
            <RyogoCaption color="light">{t("ReceivedAmount")}</RyogoCaption>
            <RyogoP color="brand">{"₹" + receivedAmount}</RyogoP>
          </SectionRowWrapper>
          <SectionRowWrapper
            small
            className="w-full items-center justify-between"
          >
            <RyogoCaption color="light">{t("PendingAmount")}</RyogoCaption>
            <RyogoP color="yellow">{"₹" + pendingAmount}</RyogoP>
          </SectionRowWrapper>
          {bookingDetails.confirmationUrl && (isConfirmed || isInProgress) && (
            <BookingViewConfirmationButton bookingDetails={bookingDetails} />
          )}
          {bookingDetails.invoiceUrl && isCompleted && (
            <BookingViewInvoiceButton bookingDetails={bookingDetails} />
          )}
        </BookingSection>
        <BookingSection sectionTitle={t("VehicleInfo")} icon={Car}>
          <BookingVehicleCard vehicle={bookingDetails.assignedVehicle} />
        </BookingSection>
        <BookingSection sectionTitle={t("DriverInfo")} icon={IdCard}>
          <BookingDriverCard driver={bookingDetails.assignedDriver} />
          {bookingDetails.assignedDriver && (
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
      </BookingGrid>
      <StickyActionWrapper>
        {isCompleted &&
          bookingDetails.customer.email &&
          bookingDetails.assignedDriver &&
          !bookingDetails.ratingByCustomer && (
            <RateBookingByCustomerDialog
              bookingId={bookingDetails.id}
              driverId={bookingDetails.assignedDriver.id}
              codeSentOn={bookingDetails.codeSentOn}
            />
          )}
        <Link href="/track/booking">
          <RyogoOutlineButton
            label={t("TrackAnother")}
            labelColor="light"
            className="w-full"
          />
        </Link>
      </StickyActionWrapper>
    </PageWrapper>
  )
}
