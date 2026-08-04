import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  Play,
  MapPinCheck,
  Handshake,
  FlagTriangleRight,
  CheckCheck,
} from "lucide-react"

export default function getTripLogIcon(type: TripLogTypesEnum) {
  switch (type) {
    case TripLogTypesEnum.STARTED:
      return Play
    case TripLogTypesEnum.ARRIVED:
      return MapPinCheck
    case TripLogTypesEnum.PICKED_UP:
      return Handshake
    case TripLogTypesEnum.DROPPED:
      return FlagTriangleRight
    case TripLogTypesEnum.ENDED:
      return CheckCheck
  }
}
