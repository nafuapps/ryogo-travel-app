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
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import OnTripDriversComponent from "@/components/flows/drivers/home/onTripDriversComponent"
import AllDriversListComponent from "@/components/flows/drivers/home/allDriversListComponent"
import DriversScheduleChartComponent from "@/components/flows/drivers/home/driversScheduleChartComponent"
import {
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { BASIC_PLAN_DRIVER_LIMIT } from "@/lib/uiConfig"
import Link from "next/link"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { getTranslations } from "next-intl/server"

export const metadata: Metadata = {
  title: `Drivers - ${pageTitle}`,
  description: pageDescription,
}

export default async function AllDriversPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agencyId = currentUser.agencyId
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
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
        <AllDriversListComponent allDrivers={allDrivers} />
        <DriversScheduleChartComponent
          driverSchedule14Days={driverSchedule14Days}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
          userId={currentUser.userId}
        />
        <StickyActionWrapper>
          {(agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC ||
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
