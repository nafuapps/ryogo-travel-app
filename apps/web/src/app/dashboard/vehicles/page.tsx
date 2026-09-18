import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import { MainWrapper, PageWrapper } from "@/components/page/pageWrappers"
import VehiclesScheduleChartComponent from "@/components/flows/vehicles/home/vehiclesScheduleChartComponent"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import OnTripVehiclesComponent from "@/components/flows/vehicles/home/onTripVehiclesComponent"
import AllVehiclesListComponent from "@/components/flows/vehicles/home/allVehiclesListComponent"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"

export const metadata: Metadata = {
  title: `Vehicles - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllVehiclesPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const agencyId = currentUser.agencyId

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)

  const allVehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  const vehicleSchedule14Days =
    await vehicleServices.findVehiclesScheduleNextDays(agencyId, 14)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles"} />
      <PageWrapper id="AllVehiclesPage">
        {ongoingTrips.length > 0 && (
          <OnTripVehiclesComponent ongoingTrips={ongoingTrips} />
        )}
        <AllVehiclesListComponent allVehicles={allVehicles} />
        <VehiclesScheduleChartComponent
          vehicleSchedule14Days={vehicleSchedule14Days}
          userId={currentUser.userId}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
      </PageWrapper>
    </MainWrapper>
  )
}
