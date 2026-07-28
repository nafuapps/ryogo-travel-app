import { RyogoP, RyogoSmall, RyogoCaption } from "@/components/typography"
import {
  FindVehiclesOnTripType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { Route } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import moment from "moment"
import { TripLogStatusPill } from "@/components/pills/ryogoPills"
import {
  GridItemWrapper,
  HoverGridWrapper,
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
        <RyogoIcon icon={Route} size="sm" color="light" />
        <RyogoSmall color="light">{t("Title")}</RyogoSmall>
        <RyogoSmall color="light" weight="font-bold">
          {onTripVehicles.length}
        </RyogoSmall>
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
      <HoverGridWrapper>
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
      </HoverGridWrapper>
    </Link>
  )
}
