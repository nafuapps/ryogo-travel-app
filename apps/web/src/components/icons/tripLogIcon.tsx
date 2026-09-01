import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  Play,
  MapPinHouse,
  Handshake,
  FlagTriangleRight,
  CheckCheck,
  Signpost,
} from "lucide-react"

export default function getTripLogIcon(type: TripLogTypesEnum) {
  switch (type) {
    case TripLogTypesEnum.STARTED:
      return Play
    case TripLogTypesEnum.ARRIVED:
      return MapPinHouse
    case TripLogTypesEnum.PICKED_UP:
      return Handshake
    case TripLogTypesEnum.DROPPED:
      return FlagTriangleRight
    case TripLogTypesEnum.ENDED:
      return CheckCheck
    case TripLogTypesEnum.OTHER:
      return Signpost
  }
}
