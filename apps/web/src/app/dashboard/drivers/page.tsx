import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import AllDriversListComponent from "@/components/flows/drivers/home/allDriversListComponent"
import DriversScheduleChartComponent from "@/components/flows/drivers/home/driversScheduleChartComponent"
import OnTripDriversComponent from "@/components/flows/drivers/home/onTripDriversComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import {
  APP_TRIAL_MODE,
  BASIC_PLAN_DRIVER_LIMIT,
} from "@ryogo-travel-app/api/apiConfig"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Drivers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllDriversPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()
  const agencyId = currentUser.agencyId
  const isSubscribed = currentUser.isSubscribed

  const t = await getTranslations("Dashboard.Drivers.All")

  const ongoingTrips = await bookingServices.findOngoingTrips(agencyId)
  const allDrivers = await driverServices.findDriversByAgency(agencyId)

  const driverSchedule14Days = await driverServices.findDriversScheduleNextDays(
    agencyId,
    14,
  )
  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers"} />
      <PageWrapper id="AllDriversPage">
        {ongoingTrips.length > 0 && (
          <OnTripDriversComponent ongoingTrips={ongoingTrips} />
        )}
        <AllDriversListComponent
          allDrivers={allDrivers}
          isSubscribed={isSubscribed}
          hasTriedSubscription={currentUser.hasTriedSubscription}
        />
        <DriversScheduleChartComponent
          driverSchedule14Days={driverSchedule14Days}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          userId={currentUser.userId}
        />
        <StickyActionWrapper>
          {(isSubscribed ||
            APP_TRIAL_MODE ||
            allDrivers.length < BASIC_PLAN_DRIVER_LIMIT) && (
            <Link href={`/dashboard/drivers/new`} className="w-full">
              <RyogoDefaultButton
                size="lg"
                label={t("AddDriver")}
                className="w-full"
              />
            </Link>
          )}
          <HelpIconButton
            href={"/dashboard/support/help-drivers"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
