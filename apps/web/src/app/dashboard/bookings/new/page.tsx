import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { MainWrapper } from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import NewBookingPageComponent from "./newBooking"

export const metadata: Metadata = {
  title: `New Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewBookingPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    notFound()
  }

  const customers = await customerServices.findCustomersInAgency(agency.id)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/new"} />
      <NewBookingPageComponent
        userId={currentUser.userId}
        agency={agency}
        customers={customers}
      />
    </MainWrapper>
  )
}
