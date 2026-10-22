import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  APP_TRIAL_MODE,
  BASIC_SEARCH_LIMIT_DAYS,
  PREMIUM_SEARCH_DAYS,
} from "@ryogo-travel-app/api/apiConfig"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import CustomerCompletedBookingsPageComponent from "./customerCompletedBookings"

export const metadata: Metadata = {
  title: `Customer Completed Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerCompletedBookingsPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const { customerId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookings = await customerServices.findCustomerCompletedBookingsById(
    customerId,
    currentUser.isSubscribed || APP_TRIAL_MODE
      ? PREMIUM_SEARCH_DAYS
      : BASIC_SEARCH_LIMIT_DAYS,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/customers/[id]/completed"} />
      <CustomerDetailHeaderTabs selectedTab={"Completed"} id={customerId} />
      <CustomerCompletedBookingsPageComponent bookings={bookings} />
    </MainWrapper>
  )
}
