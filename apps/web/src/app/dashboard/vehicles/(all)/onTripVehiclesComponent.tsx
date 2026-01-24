import {
  Caption,
  CaptionBold,
  H5Grey,
  PBold,
  PGrey,
} from "@/components/typography"
import {
  FindVehiclesOnTripType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { LucideRoute } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  gridClassName,
  gridItemClassName,
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "../../components/pageCommons"
import moment from "moment"

export default async function OnTripVehiclesComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Vehicles.OnTrip")
  const onTripVehicles = await vehicleServices.findVehiclesOnTrip(agencyId)

  return (
    <div id="OnTripVehiclesSection" className={sectionClassName}>
      <div id="OnTripVehiclesHeader" className={sectionHeaderClassName}>
        <LucideRoute className={iconClassName} />
        <PGrey>{t("Title")}</PGrey>
        <H5Grey>{onTripVehicles.length}</H5Grey>
      </div>
      {onTripVehicles.map((vehicle) => (
        <OnTripVehicleComponent key={vehicle.id} {...vehicle} />
      ))}
    </div>
  )
}

function OnTripVehicleComponent(props: FindVehiclesOnTripType[number]) {
  const booking = props.assignedBookings[0]
  return (
    <Link href={`/dashboard/bookings/${booking?.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.brand + " " + props.model}</Caption>
          <PBold>{props.vehicleNumber}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking?.id}</Caption>
          <PBold>{booking?.assignedDriver?.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>
            {moment(booking?.startDate).format("DD MMM") +
              " - " +
              moment(booking?.endDate).format("DD MMM")}
          </Caption>
          <PBold>
            {booking?.source.city + " - " + booking?.destination.city}
          </PBold>
        </div>
        <div className={gridItemClassName}>
          <div className="flex justify-center items-center rounded-full bg-slate-200 px-2 py-1.5 lg:px-3 lg:py-2">
            <CaptionBold>
              {booking?.tripLogs[0]?.type.toUpperCase()}
            </CaptionBold>
          </div>
        </div>
      </div>
    </Link>
  )
}
