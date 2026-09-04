import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import ChangeStartTimeSheet from "@/components/sheets/changeStartTimeSheet"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { getDisplayTime } from "@/lib/utils"
import { ClockPlus, SquarePen } from "lucide-react"
import { getTranslations } from "next-intl/server"

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
      <div className="border flex p-2 lg:p-3 gap-2 lg:gap-3 justify-between items-center rounded-md">
        <SectionColWrapper wFull small>
          <RyogoCaption color="light">{t("StartTime")}</RyogoCaption>
          <RyogoSmall color="slate">{getDisplayTime(startTime)}</RyogoSmall>
        </SectionColWrapper>
        {canEdit && (
          <ChangeStartTimeSheet
            bookingId={bookingId}
            agencyId={agencyId}
            userId={userId}
            originalStartTime={startTime}
          >
            <RyogoEnclosedIcon icon={SquarePen} size="sm" />
          </ChangeStartTimeSheet>
        )}
      </div>
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
        <div className="border border-dashed rounded-md flex items-center justify-center p-2 lg:p-3 gap-2 lg:gap-3">
          <RyogoEnclosedIcon icon={ClockPlus} size="sm" />
          <RyogoCaption color="slate">{t("AddStartTime")}</RyogoCaption>
        </div>
      </ChangeStartTimeSheet>
    )
  }
  return null
}
