import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { redirect, RedirectType } from "next/navigation"
import { missionServices } from "@ryogo-travel-app/api/services/mission.services"
import RiderHeader from "@/components/header/riderHeader"
import MyMissionDetailHeaderTabs from "@/components/header/detailHeaderTabs/myMissionDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import Link from "next/link"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import RemindersPageComponent from "@/components/missions/reminders"

export const metadata: Metadata = {
  title: `My Reminders - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyRemindersPage() {
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
      <RiderHeader pathName={"/rider/myMissions/myReminders"} />
      <MyMissionDetailHeaderTabs selectedTab={"Reminders"} />
      <PageWrapper id="MyRemindersPage">
        <RemindersPageComponent reminders={reminders} isRider />
        <StickyActionWrapper>
          <Link href={`/rider/myMissions/myReminders/add`} className="w-full">
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
