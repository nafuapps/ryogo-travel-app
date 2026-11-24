import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { CustomerIdRegex } from "@/lib/regex"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { CustomerStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { redirect, RedirectType } from "next/navigation"
import NewBookingWithCustomerPageComponent from "./newBookingWithCustomer"

export const metadata: Metadata = {
  title: `Create Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewBookingCustomerPage({
  params,
}: {
  params: Promise<{
    customerId: string
  }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { customerId } = await params

  if (CustomerIdRegex.safeParse(customerId).success === false) {
    redirect("/dashboard/bookings/new", RedirectType.replace)
  }

  const customer = await customerServices.findCustomerDetailsById(customerId)
  if (
    !customer ||
    customer.agencyId !== currentUser.agencyId ||
    customer.status !== CustomerStatusEnum.ACTIVE
  ) {
    redirect("/dashboard/bookings/new", RedirectType.replace)
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/new/[id]"} />
      <NewBookingWithCustomerPageComponent
        userId={currentUser.userId}
        agencyId={currentUser.agencyId}
        isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        customerId={customerId}
        isSubscribed={currentUser.isSubscribed}
        hasTriedSubscription={currentUser.hasTriedSubscription}
        subscriptionExpiresOn={currentUser.subscriptionExpiresOn}
      />
    </MainWrapper>
  )
}
