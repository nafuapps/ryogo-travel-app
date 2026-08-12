//Bookings/id/assign-user page (only for owner)

import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import AssignUserPageComponent from "./assignUser"
import { Metadata } from "next"
import { BASIC_PLAN_AGENT_LIMIT, TRIAL_MODE } from "@/lib/uiConfig"
import { MainWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"

export const metadata: Metadata = {
  title: `Assign User - ${pageTitle}`,
  description: pageDescription,
}

export default async function AssignUserBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  //Get current user
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Only owner can assign user
  if (currentUser.userRole !== UserRolesEnum.OWNER) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //Get booking details from DB
  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Get agency details
  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Get users data with their bookings and leaves (for available users and allowance per day)
  const allUsers = await userServices.findOwnerAndAgentsByAgency(
    currentUser.agencyId,
  )

  let users = allUsers
  let limited = false

  //SUBSCRIPTION BLOCKER: Limit the agents available for assignment
  if (
    !TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date()) &&
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
        isSubscribed={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
        hasTriedSubscription={agency.hasTriedSubscription}
      />
    </MainWrapper>
  )
}
