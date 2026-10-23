import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"
import RemindersPageComponent from "@/components/missions/reminders"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Reminders - ${pageTitle}`,
  description: pageDescription,
}

export default async function RemindersPage() {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const t = await getTranslations("Dashboard.Reminders")

  const reminders = await missionServices.findRemindersByUserId(
    currentUser.userId,
  )

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/missions/reminders"} />
      <MissionDetailHeaderTabs selectedTab={"Reminders"} />
      <PageWrapper id="RemindersPage">
        <RemindersPageComponent reminders={reminders} />
        <StickyActionWrapper>
          <Link href={`/dashboard/missions/reminders/add`} className="w-full">
            <RyogoDefaultButton
              size="lg"
              label={t("AddReminder")}
              className="w-full"
            />
          </Link>
          <HelpIconButton
            href={"/rider/mySupport/help-missions"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
