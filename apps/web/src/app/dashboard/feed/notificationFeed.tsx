import NotificationCard from "@/components/notifications/notificationCard"
import { PageWrapper, SectionColWrapper } from "@/components/page/pageWrappers"
import { FindFeedNotificationsByAgencyIdType } from "@ryogo-travel-app/api/services/notification.services"
import { getTranslations } from "next-intl/server"

export default async function NotificationFeedPageComponent({
  notifications,
}: {
  notifications: FindFeedNotificationsByAgencyIdType
}) {
  const t = await getTranslations("Dashboard.Feed")
  return (
    <PageWrapper id="NotificationFeedPage">
      <SectionColWrapper>
        {notifications.length === 0 ? (
          <p>{t("NoFeed")}</p>
        ) : (
          notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))
        )}
      </SectionColWrapper>
    </PageWrapper>
  )
}
