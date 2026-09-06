import ChangeStartTimeSheet from "@/components/sheets/changeStartTimeSheet"
import { getDisplayTime } from "@/lib/utils"
import { ClipboardClock } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  BookingAddTripInfoWrapper,
  BookingEditTripInfoWrapper,
} from "./bookingDetailsCommon"

export default async function BookingStartTimeCard({
  bookingId,
  userId,
  agencyId,
  startTime,
  canEdit,
}: {
  bookingId: string
  userId: string
  agencyId: string
  startTime: string | null
  canEdit: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  if (startTime) {
    return (
      <ChangeStartTimeSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalStartTime={startTime}
        canEdit={canEdit}
      >
        <BookingEditTripInfoWrapper
          icon={ClipboardClock}
          label={t("StartTime")}
          value={getDisplayTime(startTime)}
          canEdit={canEdit}
        />
      </ChangeStartTimeSheet>
    )
  }

  if (canEdit) {
    return (
      <ChangeStartTimeSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalStartTime={startTime}
      >
        <BookingAddTripInfoWrapper
          icon={ClipboardClock}
          label={t("AddStartTime")}
        />
      </ChangeStartTimeSheet>
    )
  }
  return null
}
