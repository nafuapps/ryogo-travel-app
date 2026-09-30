import { BookingTypeEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon, RyogoIconType } from "./ryogoIcon"
import { ArrowRight, ArrowRightLeft, Waypoints } from "lucide-react"

export default function GetTripTypeIcon({
  type,
  ...props
}: Omit<RyogoIconType, "icon"> & {
  type: BookingTypeEnum
}) {
  switch (type) {
    case BookingTypeEnum.OneWay:
      return <RyogoIcon {...props} icon={ArrowRight} />
    case BookingTypeEnum.Round:
      return <RyogoIcon {...props} icon={ArrowRightLeft} />
    case BookingTypeEnum.MultiDay:
      return <RyogoIcon {...props} icon={Waypoints} />
  }
}
