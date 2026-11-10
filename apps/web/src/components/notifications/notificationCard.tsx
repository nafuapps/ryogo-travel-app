import getEntityIcon from "@/components/icons/entityIcon"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoTiny } from "@/components/typography"
import { FindFeedNotificationsByAgencyIdType } from "@ryogo-travel-app/api/services/notification.services"
import { ChevronRight } from "lucide-react"
import moment from "moment"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function NotificationCard({
  notification,
  hideLink,
}: {
  notification: FindFeedNotificationsByAgencyIdType[number]
  hideLink?: boolean
}) {
  const t = useTranslations("Dashboard.Feed.Notifications")
  return (
    <SectionWrapper id={notification.id}>
      <SectionRowWrapper className="items-center justify-start">
        <RyogoEnclosedIcon
          icon={getEntityIcon(notification.entityType)}
          size="sm"
          color="brand"
          bgColor="brand"
          circular
        />
        <SectionColWrapper small className="w-full">
          <RyogoCaption>
            {t(
              notification.textKey as Parameters<typeof t>[0],
              notification.textObject as Record<string, string | number | Date>,
            )}
          </RyogoCaption>
          <RyogoTiny color="light">
            {moment(notification.createdAt).fromNow()}
          </RyogoTiny>
        </SectionColWrapper>
        {notification.link && !hideLink && (
          <Link
            href={
              notification.link as React.ComponentProps<typeof Link>["href"]
            }
            prefetch={false}
          >
            <RyogoEnclosedIcon icon={ChevronRight} size="sm" color="slate" />
          </Link>
        )}
      </SectionRowWrapper>
    </SectionWrapper>
  )
}
