import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { FindNotificationsByUserIdType } from "@ryogo-travel-app/api/services/notification.services"
import NotificationCard from "@/components/notifications/notificationCard"

export default async function UserActivityPageComponent({
  activities,
  id,
}: {
  activities: FindNotificationsByUserIdType
  id: string
}) {
  return (
    <PageWrapper id="UserActivityPage">
      <UserDetailHeaderTabs selectedTab={"Activity"} id={id} />
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
    </PageWrapper>
  )
}
