import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import BookingDetailsPageComponent from "./bookingDetails"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import {
  BookingStatusEnum,
  ProductFeedbackTypeEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import NewFeedbackComponent from "@/components/flows/feedback/newFeedback"

export const metadata: Metadata = {
  title: `Booking Details - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<{ feedback?: string | undefined }>
}) {
  const { bookingId } = await params

  const feedback = (await searchParams).feedback

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

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
      <BookingDetailsPageComponent
        bookingDetails={bookingDetails}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        isAssignedUser={bookingDetails.assignedUser.id === currentUser.userId}
      />
    </MainWrapper>
  )
}
