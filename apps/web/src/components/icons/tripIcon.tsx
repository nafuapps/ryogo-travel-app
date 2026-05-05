import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { ArrowRightFromLine, ArrowRightLeft, Waypoints } from "lucide-react"
import { RyogoIcon, RyogoIconSize } from "./RyogoIcon"

export default function getTripIcon(
  tripType: BookingTypeEnum,
  size?: RyogoIconSize,
) {
  if (tripType === BookingTypeEnum.OneWay) {
    return <RyogoIcon icon={ArrowRightFromLine} size={size} />
  }
  if (tripType === BookingTypeEnum.Round) {
    return <RyogoIcon icon={ArrowRightLeft} size={size} />
  }
  return <RyogoIcon icon={Waypoints} size={size} />
}
