import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import ChangeUserDropAddressSheet from "@/components/sheets/changeDropAddressSheet"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { MapPinCheck, SquarePen } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BookingDropAddressCard({
  bookingId,
  userId,
  agencyId,
  dropAddress,
  canEdit,
}: {
  bookingId: string
  userId: string
  agencyId: string
  dropAddress: string | null
  canEdit: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  if (dropAddress) {
    return (
      <div className="border flex p-2 lg:p-3 gap-2 lg:gap-3 justify-between items-center rounded-md">
        <SectionColWrapper wFull small>
          <RyogoCaption color="light">{t("DropAddress")}</RyogoCaption>
          <RyogoSmall color="slate">{dropAddress}</RyogoSmall>
        </SectionColWrapper>
        {canEdit && (
          <ChangeUserDropAddressSheet
            bookingId={bookingId}
            agencyId={agencyId}
            userId={userId}
            originalDropAddress={dropAddress}
          >
            <RyogoEnclosedIcon icon={SquarePen} size="sm" />
          </ChangeUserDropAddressSheet>
        )}
      </div>
    )
  }

  if (canEdit) {
    return (
      <ChangeUserDropAddressSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalDropAddress={dropAddress}
      >
        <div className="border border-dashed rounded-md flex items-center justify-center p-2 lg:p-3 gap-2 lg:gap-3">
          <RyogoEnclosedIcon icon={MapPinCheck} size="sm" />
          <RyogoCaption color="slate">{t("AddDropAddress")}</RyogoCaption>
        </div>
      </ChangeUserDropAddressSheet>
    )
  }
  return null
}
