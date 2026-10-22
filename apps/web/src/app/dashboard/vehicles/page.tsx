import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import AllVehiclesListComponent from "@/components/flows/vehicles/home/allVehiclesListComponent"
import OnTripVehiclesComponent from "@/components/flows/vehicles/home/onTripVehiclesComponent"
import VehiclesScheduleChartComponent from "@/components/flows/vehicles/home/vehiclesScheduleChartComponent"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"

export const metadata: Metadata = {
  title: `Vehicles - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllVehiclesPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }
  const isSubscribed = currentUser.isSubscribed
  const agencyId = currentUser.agencyId

  const t = await getTranslations("Dashboard.Vehicles.All")

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
        <AllVehiclesListComponent
          allVehicles={allVehicles}
          isSubscribed={isSubscribed}
          hasTriedSubscription={currentUser.hasTriedSubscription}
        />
        <VehiclesScheduleChartComponent
          vehicleSchedule14Days={vehicleSchedule14Days}
          userId={currentUser.userId}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
      </PageWrapper>
      <StickyActionWrapper>
        {(isSubscribed ||
          APP_TRIAL_MODE ||
          allVehicles.length < BASIC_PLAN_VEHICLE_LIMIT) && (
          <Link href={`/dashboard/vehicles/new`} className="w-full">
            <RyogoDefaultButton
              size="lg"
              label={t("AddVehicle")}
              className="w-full"
            />
          </Link>
        )}
        <HelpIconButton
          href={"/dashboard/support/help-vehicles"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </MainWrapper>
  )
}
