import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon, RyogoIconType } from "./ryogoIcon"
import { ArrowRight, ArrowRightLeft, Waypoints } from "lucide-react"

export default function GetTripTypeIcon({
  tripType,
  ...props
}: Omit<RyogoIconType, "icon"> & {
  tripType: BookingTypeEnum
}) {
  switch (tripType) {
    case BookingTypeEnum.OneWay:
      return <RyogoIcon {...props} icon={ArrowRight} />
    case BookingTypeEnum.Round:
      return <RyogoIcon {...props} icon={ArrowRightLeft} />
    case BookingTypeEnum.MultiDay:
    default:
      return <RyogoIcon {...props} icon={Waypoints} />
  }
}
