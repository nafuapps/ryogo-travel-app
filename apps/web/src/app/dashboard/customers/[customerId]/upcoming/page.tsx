import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import CustomerUpcomingBookingsPageComponent from "./customerUpcomingBookings"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"

export const metadata: Metadata = {
  title: `Customer Upcoming Bookings - ${pageTitle}`,
  description: pageDescription,
}

export default async function CustomerUpcomingBookingsPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const { customerId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const bookings =
    await customerServices.findCustomerUpcomingBookingsById(customerId)

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
