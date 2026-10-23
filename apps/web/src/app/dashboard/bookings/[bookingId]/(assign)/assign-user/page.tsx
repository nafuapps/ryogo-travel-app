//Bookings/id/assign-user page (only for owner)

import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_AGENT_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import AssignUserPageComponent from "./assignUser"

export const metadata: Metadata = {
  title: `Assign User - ${pageTitle}`,
  description: pageDescription,
}

export default async function AssignUserBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  //Only owner can assign user
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //Get booking details from DB
  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const isSubscribed = currentUser.isSubscribed

  //Get users data with their bookings and leaves (for available users and allowance per day)
  const allUsers = await userServices.findOwnerAndAgentsByAgency(
    currentUser.agencyId,
  )

  let users = allUsers
  let limited = false

  //SUBSCRIPTION BLOCKER: Limit the agents available for assignment
  if (
    !APP_TRIAL_MODE &&
    (!isSubscribed || currentUser.subscriptionExpiresOn < new Date()) &&
    allUsers.length > BASIC_PLAN_AGENT_LIMIT
  ) {
    limited = true
    //Find owner or assigned agents
    const requiredUsers = allUsers.filter(
      (u) =>
        u.userRole === UserRolesEnum.OWNER || u.id === booking.assignedUserId,
    )

    //If owners or assigned agents exceeds limit, slice and use those
    if (requiredUsers.length >= BASIC_PLAN_AGENT_LIMIT) {
      users = requiredUsers.slice(0, BASIC_PLAN_AGENT_LIMIT)
    } else {
      //Else, add extra agents to the limit
      const extraUsers = allUsers
        .filter(
          (u) =>
            u.userRole !== UserRolesEnum.OWNER &&
            u.id !== booking.assignedUserId,
        )
        .sort((u1, u2) => u2.createdAt.getTime() - u1.createdAt.getTime())
        .slice(0, BASIC_PLAN_AGENT_LIMIT - requiredUsers.length)
      users = [...requiredUsers, ...extraUsers]
    }
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/assign-user"} />
      <AssignUserPageComponent
        bookingId={bookingId}
        users={limited ? users : allUsers}
        booking={booking}
        limited={limited}
        isSubscribed={isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
