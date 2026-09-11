import { EditInfoWrapper, AddInfoWrapper } from "@/components/page/pageWrappers"
import ChangeBookingRemarksSheet from "@/components/sheets/changeBookingRemarksSheet"
import { MessageSquarePlus } from "lucide-react"
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
      <ChangeBookingRemarksSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalRemarks={remarks}
        canEdit={canEdit}
      >
        <EditInfoWrapper
          label={t("Remarks")}
          value={remarks}
          canEdit={canEdit}
          icon={MessageSquarePlus}
        />
      </ChangeBookingRemarksSheet>
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
        <AddInfoWrapper label={t("AddRemarks")} icon={MessageSquarePlus} />
      </ChangeBookingRemarksSheet>
    )
  }
  return null
}
