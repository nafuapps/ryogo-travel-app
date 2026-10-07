import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import {
  Ban,
  Check,
  Flag,
  SquarePlus,
  ListChecks,
  LucideIcon,
  Play,
  Summary,
} from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function BookingTimeline({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.BookingDetails.Timeline")

  const confirmedAt = booking.confirmedAt
  const cancelledAt = booking.cancelledAt
  const completedAt = booking.completedAt
  const startedAt = booking.startedAt
  const closedAt = booking.closedAt
  const reconciledAt = booking.reconciledAt

  return (
    <SectionColWrapper small className="p-3 lg:p-4 border rounded-md">
      <TimelineRow
        icon={SquarePlus}
        label={t("Created")}
        timestamp={booking.createdAt}
        hideSeparator
      />
      {confirmedAt && (
        <TimelineRow
          icon={Check}
          label={t("Confirmed")}
          timestamp={confirmedAt}
        />
      )}
      {cancelledAt && (
        <TimelineRow
          icon={Ban}
          label={t("Cancelled")}
          timestamp={cancelledAt}
        />
      )}
      {startedAt && (
        <TimelineRow icon={Play} label={t("Started")} timestamp={startedAt} />
      )}
      {completedAt && (
        <TimelineRow
          icon={Flag}
          label={t("Completed")}
          timestamp={completedAt}
        />
      )}
      {closedAt && (
        <>
          <TimelineRow
            icon={ListChecks}
            label={t("Closed")}
            timestamp={closedAt}
          />
        </>
      )}
      {reconciledAt && (
        <TimelineRow
          icon={Summary}
          label={t("Reconciled")}
          timestamp={reconciledAt}
        />
      )}
    </SectionColWrapper>
  )
}

function TimelineRow({
  icon,
  label,
  timestamp,
  hideSeparator,
}: {
  icon: LucideIcon
  label: string
  timestamp: Date
  hideSeparator?: boolean
}) {
  return (
    <>
      {!hideSeparator && (
        <div className="h-2 lg:h-2.5 w-px border border-dashed ml-1.75 lg:ml-2" />
      )}
      <SectionRowWrapper className="items-center">
        <RyogoIcon icon={icon} size="xs" color="light" thick />
        <RyogoCaption color="slate" className="w-full">
          {label}
        </RyogoCaption>
        <RyogoCaption color="light" className="text-nowrap">
          {moment(timestamp).format("DD MMM - hh:mm a")}
        </RyogoCaption>
      </SectionRowWrapper>
    </>
  )
}
