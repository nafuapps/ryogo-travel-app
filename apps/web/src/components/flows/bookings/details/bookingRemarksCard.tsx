import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import ChangeBookingRemarksSheet from "@/components/sheets/changeBookingRemarksSheet"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { MessageSquarePlus, SquarePen } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BookingRemarksCard({
  bookingId,
  userId,
  agencyId,
  remarks,
  canEdit,
}: {
  bookingId: string
  userId: string
  agencyId: string
  remarks: string | null
  canEdit: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  if (remarks) {
    return (
      <div className="border flex p-2 lg:p-3 gap-2 lg:gap-3 justify-between items-center rounded-md">
        <SectionColWrapper wFull small>
          <RyogoCaption color="light">{t("Remarks")}</RyogoCaption>
          <RyogoSmall color="slate">{remarks}</RyogoSmall>
        </SectionColWrapper>
        {canEdit && (
          <ChangeBookingRemarksSheet
            bookingId={bookingId}
            agencyId={agencyId}
            userId={userId}
            originalRemarks={remarks}
          >
            <RyogoEnclosedIcon icon={SquarePen} size="sm" />
          </ChangeBookingRemarksSheet>
        )}
      </div>
    )
  }

  if (canEdit) {
    return (
      <ChangeBookingRemarksSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalRemarks={remarks}
      >
        <div className="border border-dashed rounded-md flex items-center justify-center p-2 lg:p-3 gap-2 lg:gap-3">
          <RyogoEnclosedIcon icon={MessageSquarePlus} size="sm" />
          <RyogoCaption color="slate">{t("AddRemarks")}</RyogoCaption>
        </div>
      </ChangeBookingRemarksSheet>
    )
  }
  return null
}
