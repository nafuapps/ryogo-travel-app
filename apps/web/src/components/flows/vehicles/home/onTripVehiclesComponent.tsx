import {
  RyogoH4,
  RyogoP,
  RyogoSmall,
  RyogoCaption,
} from "@/components/typography"
import {
  FindVehiclesOnTripType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { Route } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import moment from "moment"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function OnTripVehiclesComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Vehicles.OnTrip")
  const onTripVehicles = await vehicleServices.findVehiclesOnTrip(agencyId)

  return (
    <SectionWrapper id="OnTripVehiclesSection">
      <SectionHeaderWrapper>
        <RyogoIcon icon={Route} size="sm" />
        <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        <RyogoH4 color="slate"> {onTripVehicles.length}</RyogoH4>
      </SectionHeaderWrapper>
      {onTripVehicles.map((vehicle) => (
        <OnTripVehicleComponent key={vehicle.id} {...vehicle} />
      ))}
    </SectionWrapper>
  )
}

function OnTripVehicleComponent(props: FindVehiclesOnTripType[number]) {
  const booking = props.assignedBookings[0]
  if (!booking) {
    return <></>
  }
  return (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <GridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {props.brand + " " + props.model}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {props.vehicleNumber}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.id}</RyogoCaption>
          {booking.assignedDriver && (
            <RyogoP weight="font-bold"> {booking.assignedDriver.name}</RyogoP>
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {moment(booking.startDate).format("DD MMM") +
              " - " +
              moment(booking.endDate).format("DD MMM")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {booking.source.city + " - " + booking.destination.city}
          </RyogoP>
        </GridItemWrapper>
        {booking.tripLogs[0] && (
          <GridItemWrapper>
            <TripLogStatusPill status={booking.tripLogs[0].type} />
          </GridItemWrapper>
        )}
      </GridWrapper>
    </Link>
  )
}
