import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import DashboardHeader from "@/components/header/dashboardHeader"
import NewBookingPageComponent from "./newBooking"

export const metadata: Metadata = {
  title: `New Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function NewBookingPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const customers = await customerServices.findCustomersInAgency(agency.id)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/new"} />
      <PageWrapper id="NewBookingPage">
        <NewBookingPageComponent
          userId={currentUser.userId}
          agency={agency}
          customers={customers}
        />
      </PageWrapper>
    </MainWrapper>
  )
}
