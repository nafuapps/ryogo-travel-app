import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { redirect, RedirectType } from "next/navigation"
import RiderHeader from "@/components/header/riderHeader"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  DriverStatusEnum,
} from "@ryogo-travel-app/db/schema"
import RiderMyOngoingBookingPageComponent from "./currentBooking"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { Metadata } from "next"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import MyBookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/myBookingDetailHeaderTabs"
import RiderMyBookingDetails from "@/components/flows/rider/riderMyBookingDetails"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import StartTripSheet from "@/components/flows/rider/tripSheets/startTripSheet"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export const metadata: Metadata = {
  title: `My Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails || !bookingDetails.assignedDriverId) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const driver = await driverServices.findDriverDetailsById(
    bookingDetails.assignedDriverId,
  )
  if (!driver) {
    redirect("/rider/myBookings", RedirectType.replace)
  }

  const t = await getTranslations("Rider.MyBooking")

  const canStartTrip =
    bookingDetails.status === BookingStatusEnum.CONFIRMED &&
    bookingDetails.startDate <= new Date() &&
    bookingDetails.assignedVehicleId !== null &&
    driver.status === DriverStatusEnum.AVAILABLE

  //Render action based on booking status
  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]"} />
      <PageWrapper id="MyBookingPage">
        <MyBookingDetailHeaderTabs id={bookingId} selectedTab={"Booking"} />
        <RiderMyBookingDetails
          booking={bookingDetails}
          canCommunicateWithCustomer={
            bookingDetails.status === BookingStatusEnum.IN_PROGRESS
              ? true
              : bookingDetails.status === BookingStatusEnum.COMPLETED
                ? false
                : canStartTrip
          }
        />
        <StickyActionWrapper>
          {bookingDetails.status === BookingStatusEnum.IN_PROGRESS ? (
            <RiderMyOngoingBookingPageComponent booking={bookingDetails} />
          ) : bookingDetails.status === BookingStatusEnum.CONFIRMED ? (
            canStartTrip ? (
              <StartTripSheet booking={bookingDetails} />
            ) : null
          ) : (
            <Link href="/rider/myBookings">
              <RyogoDefaultButton label={t("Back")} className="w-full" />
            </Link>
          )}
          <HelpIconButton
            href={"/rider/mySupport/help-bookings"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
