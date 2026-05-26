import { Card } from "@/components/ui/card"
import { FindFeedNotificationsByAgencyIdType } from "@ryogo-travel-app/api/services/notification.services"

export default function NotificationCard({
  notification,
}: {
  notification: FindFeedNotificationsByAgencyIdType[number]
}) {
  return <Card></Card>
}
