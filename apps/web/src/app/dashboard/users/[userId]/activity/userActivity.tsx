import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import {
  PageWrapper,
  SectionWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FindNotificationsByUserIdType } from "@ryogo-travel-app/api/services/notification.services"
import NotificationCard from "@/components/notifications/notificationCard"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { getTranslations } from "next-intl/server"
import { TagX } from "lucide-react"

export default async function UserActivityPageComponent({
  activities,
  id,
}: {
  activities: FindNotificationsByUserIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.UserActivity")
  return (
    <PageWrapper id="UserActivityPage">
      <UserDetailHeaderTabs selectedTab={"Activity"} id={id} />
      {activities.length > 0 ? (
        <SectionWrapper id="NotificationActivityList">
          {activities.map((notification) => {
            return (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            )
          })}
        </SectionWrapper>
      ) : (
        <EmptyStateIcon icon={TagX} label={t("NoActivities")} />
      )}
      <StickyActionWrapper>
        <HelpIconButton
          href={"/dashboard/support/help-users#managing"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
