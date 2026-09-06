import ChangeUserPickupAddressSheet from "@/components/sheets/changePickupAddressSheet"
import { MapPinHouse } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  BookingAddTripInfoWrapper,
  BookingEditTripInfoWrapper,
} from "./bookingDetailsCommon"

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
      <ChangeUserPickupAddressSheet
        bookingId={bookingId}
        agencyId={agencyId}
        userId={userId}
        originalPickupAddress={pickupAddress}
        customerAddress={customerAddress}
        canEdit={canEdit}
      >
        <BookingEditTripInfoWrapper
          label={t("PickupAddress")}
          value={pickupAddress}
          canEdit={canEdit}
          icon={MapPinHouse}
        />
      </ChangeUserPickupAddressSheet>
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
        <BookingAddTripInfoWrapper
          icon={MapPinHouse}
          label={t("AddPickupAddress")}
        />
      </ChangeUserPickupAddressSheet>
    )
  }
  return null
}
