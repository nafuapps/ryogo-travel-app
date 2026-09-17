import { VehicleColorEnum } from "@ryogo-travel-app/db/schema"

export default function VehicleColorBox({
  color,
  className,
}: {
  color: VehicleColorEnum
  className?: string
}) {
  let colorClassName
  switch (color) {
    case VehicleColorEnum.BLACK:
      colorClassName = "bg-black border"
      break
    case VehicleColorEnum.BLUE:
      colorClassName = "bg-blue-500"
      break
    case VehicleColorEnum.PINK:
      colorClassName = "bg-pink-500"
      break
    case VehicleColorEnum.RED:
      colorClassName = "bg-red-500"
      break
    case VehicleColorEnum.WHITE:
      colorClassName = "bg-white border"
      break
    case VehicleColorEnum.YELLOW:
      colorClassName = "bg-yellow-500"
      break
    case VehicleColorEnum.GREEN:
      colorClassName = "bg-green-500"
      break
    case VehicleColorEnum.ORANGE:
      colorClassName = "bg-orange-500"
      break
    case VehicleColorEnum.PURPLE:
      colorClassName = "bg-purple-500"
      break
    case VehicleColorEnum.BROWN:
      colorClassName = "bg-brown-500"
      break
    case VehicleColorEnum.SILVER:
      colorClassName = "bg-mist-500"
      break
    case VehicleColorEnum.GRAY:
    default:
      colorClassName = "bg-gray-500"
  }
  return (
    <div
      className={`${colorClassName} size-4 lg:size-5 rounded ${className ?? ""}`}
    />
  )
}
