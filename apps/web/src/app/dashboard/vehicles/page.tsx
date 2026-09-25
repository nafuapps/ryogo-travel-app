import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { getCurrentUser } from "@/lib/auth"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import VehiclesScheduleChartComponent from "@/components/flows/vehicles/home/vehiclesScheduleChartComponent"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import OnTripVehiclesComponent from "@/components/flows/vehicles/home/onTripVehiclesComponent"
import AllVehiclesListComponent from "@/components/flows/vehicles/home/allVehiclesListComponent"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { BASIC_PLAN_VEHICLE_LIMIT } from "@/lib/uiConfig"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

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
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

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
        <AllVehiclesListComponent allVehicles={allVehicles} />
        <VehiclesScheduleChartComponent
          vehicleSchedule14Days={vehicleSchedule14Days}
          userId={currentUser.userId}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
        />
      </PageWrapper>
      <StickyActionWrapper>
        {(agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC ||
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
