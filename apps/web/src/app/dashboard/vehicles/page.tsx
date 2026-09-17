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

  const onTripVehicles = await vehicleServices.findVehiclesOnTrip(agencyId)
  const allVehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  const vehicleSchedule14Days =
    await vehicleServices.findVehiclesScheduleNextDays(agencyId, 14)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles"} />
      <PageWrapper id="AllVehiclesPage">
        <OnTripVehiclesComponent onTripVehicles={onTripVehicles} />
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
