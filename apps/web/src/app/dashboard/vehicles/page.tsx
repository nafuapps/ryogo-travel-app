import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import AllVehiclesListComponent from "@/components/flows/vehicles/home/allVehiclesListComponent"
import DashboardHeader from "@/components/header/dashboardHeader"
import AllVehiclesHeaderTabs from "@/components/header/detailHeaderTabs/allVehiclesHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Vehicles - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllVehiclesPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const isSubscribed = currentUser.isSubscribed
  const agencyId = currentUser.agencyId

  const t = await getTranslations("Dashboard.Vehicles.All")

  const allVehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/vehicles"} />
      <AllVehiclesHeaderTabs selectedTab={"Home"} />

      <PageWrapper id="AllVehiclesPage">
        <AllVehiclesListComponent
          allVehicles={allVehicles}
          isSubscribed={isSubscribed}
          hasTriedSubscription={currentUser.hasTriedSubscription}
        />
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
      </PageWrapper>
    </MainWrapper>
  )
}
