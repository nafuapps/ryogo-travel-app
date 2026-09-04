import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import ChangeUserPickupAddressSheet from "@/components/sheets/changePickupAddressSheet"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { MapPinHouse, SquarePen } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BookingPickupAddressCard({
  bookingId,
  userId,
  agencyId,
  pickupAddress,
  customerAddress,
  canEdit,
}: {
  bookingId: string
  userId: string
  agencyId: string
  pickupAddress: string | null
  customerAddress: string | null
  canEdit: boolean
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  if (pickupAddress) {
    return (
      <div className="border flex p-2 lg:p-3 gap-2 lg:gap-3 justify-between items-center rounded-md">
        <SectionColWrapper wFull small>
          <RyogoCaption color="light">{t("PickupAddress")}</RyogoCaption>
          <RyogoSmall color="slate">{pickupAddress}</RyogoSmall>
        </SectionColWrapper>
        {canEdit && (
          <ChangeUserPickupAddressSheet
            bookingId={bookingId}
            agencyId={agencyId}
            userId={userId}
            originalPickupAddress={pickupAddress}
            customerAddress={customerAddress}
          >
            <RyogoEnclosedIcon icon={SquarePen} size="sm" />
          </ChangeUserPickupAddressSheet>
        )}
      </div>
    )
  }

  if (canEdit) {
    return (
      <ChangeUserPickupAddressSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalPickupAddress={pickupAddress}
        customerAddress={customerAddress}
      >
        <div className="border border-dashed rounded-md flex items-center justify-center p-2 lg:p-3 gap-2 lg:gap-3">
          <RyogoEnclosedIcon icon={MapPinHouse} size="sm" />
          <RyogoCaption color="slate">{t("AddPickupAddress")}</RyogoCaption>
        </div>
      </ChangeUserPickupAddressSheet>
    )
  }
  return null
}
