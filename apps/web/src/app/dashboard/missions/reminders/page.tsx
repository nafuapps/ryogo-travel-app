import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import DashboardHeader from "@/components/header/dashboardHeader"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import MissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/missionDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import Link from "next/link"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import RemindersPageComponent from "@/components/missions/reminders"

export const metadata: Metadata = {
  title: `Reminders - ${pageTitle}`,
  description: pageDescription,
}

export default async function RemindersPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

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
