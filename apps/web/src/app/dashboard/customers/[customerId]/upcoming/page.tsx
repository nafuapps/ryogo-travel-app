import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import CustomerUpcomingBookingsPageComponent from "./customerUpcomingBookings"

export const metadata: Metadata = {
  title: `Customer Upcoming Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerUpcomingBookingsPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { customerId } = await params

  const bookings = await customerServices.findCustomerUpcomingBookingsById(
    customerId,
    currentUser.isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/[id]/upcoming"} />
      <CustomerDetailHeaderTabs selectedTab={"Upcoming"} id={customerId} />
      <CustomerUpcomingBookingsPageComponent
        bookings={bookings}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        userId={currentUser.userId}
      />
    </MainWrapper>
  )
}
