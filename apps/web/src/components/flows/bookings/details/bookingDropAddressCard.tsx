import ChangeUserDropAddressSheet from "@/components/sheets/changeDropAddressSheet"
import { MapPinCheck } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  BookingAddTripInfoWrapper,
  BookingEditTripInfoWrapper,
} from "./bookingDetailsCommon"

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
      <ChangeUserDropAddressSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalDropAddress={dropAddress}
        canEdit={canEdit}
      >
        <BookingEditTripInfoWrapper
          label={t("DropAddress")}
          value={dropAddress}
          canEdit={canEdit}
          icon={MapPinCheck}
        />
      </ChangeUserDropAddressSheet>
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
        <BookingAddTripInfoWrapper
          label={t("AddDropAddress")}
          icon={MapPinCheck}
        />
      </ChangeUserDropAddressSheet>
    )
  }
  return null
}
