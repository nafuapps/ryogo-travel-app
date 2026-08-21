import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper } from "@/components/page/pageWrappers"
import { CustomerStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import NewBookingWithCustomerPageComponent from "./newBookingWithCustomer"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { CustomerIdRegex } from "@/lib/regex"

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
  const { customerId } = await params

  if (CustomerIdRegex.safeParse(customerId).success === false) {
    redirect("/dashboard/bookings/new", RedirectType.replace)
  }

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
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
      />
    </MainWrapper>
  )
}
