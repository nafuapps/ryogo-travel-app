import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import BookingDetailsPageComponent from "./bookingDetails"

export const metadata: Metadata = {
  title: `Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<{ feedback?: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const feedback = (await searchParams).feedback

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]"} />
      {feedback === "true" &&
        bookingDetails.status === BookingStatusEnum.LEAD && (
          <NewFeedbackComponent
            entityId={bookingId}
            feedbackType={ProductFeedbackTypeEnum.NEW_BOOKING}
            userId={currentUser.userId}
            agencyId={currentUser.agencyId}
          />
        )}
      <BookingDetailHeaderTabs id={bookingDetails.id} selectedTab="Booking" />
      <BookingDetailsPageComponent
        bookingDetails={bookingDetails}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        isAssignedUser={bookingDetails.assignedUser.id === currentUser.userId}
        isPremium={currentUser.isSubscribed}
      />
    </MainWrapper>
  )
}
