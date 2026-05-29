import { FindFeedNotificationsByAgencyIdType } from "@ryogo-travel-app/api/services/notification.services"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { ChevronRight } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { useTranslations } from "next-intl"
import { RyogoCaption } from "@/components/typography"
import Link from "next/link"
import moment from "moment"
import { UrlObject } from "url"
import getEntityIcon from "@/components/icons/entityIcon"

export default function NotificationCard({
  notification,
}: {
  notification: FindFeedNotificationsByAgencyIdType[number]
}) {
  const t = useTranslations("Dashboard.Feed.Notifications")
  return (
    <SectionWrapper id={notification.id}>
      <SectionRowWrapper justifyStart>
        <RyogoEnclosedIcon
          icon={getEntityIcon(notification.entityType)}
          size="sm"
          color="brand"
          bgColor="brand"
          circular
        />
        <SectionColWrapper small wFull>
          <RyogoCaption>
            {t(
              notification.textKey as Parameters<typeof t>[0],
              notification.textObject as Record<string, string | number | Date>,
            )}
          </RyogoCaption>
          <RyogoCaption color="light">
            {moment(notification.createdAt).calendar()}
          </RyogoCaption>
        </SectionColWrapper>
        {notification.link && (
          <Link href={notification.link as any as UrlObject}>
            <RyogoEnclosedIcon
              icon={ChevronRight}
              size="sm"
              color="slate"
              bgColor="light"
            />
          </Link>
        )}
      </SectionRowWrapper>
    </SectionWrapper>
  )
}
