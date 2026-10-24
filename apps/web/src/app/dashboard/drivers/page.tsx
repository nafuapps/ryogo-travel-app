import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import AllDriversListComponent from "@/components/flows/drivers/home/allDriversListComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import AllDriversHeaderTabs from "@/components/header/detailHeaderTabs/allDriversHeaderTabs"
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
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
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

  const allDrivers = await driverServices.findDriversByAgency(agencyId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/drivers"} />
      <AllDriversHeaderTabs selectedTab={"Home"} />
      <PageWrapper id="AllDriversPage">
        <AllDriversListComponent
          allDrivers={allDrivers}
          isSubscribed={isSubscribed}
          hasTriedSubscription={currentUser.hasTriedSubscription}
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
