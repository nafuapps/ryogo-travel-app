import {
  Caption,
  CaptionBold,
  H5Grey,
  PBold,
  SmallGrey,
} from "@/components/typography"
import {
  FindVehiclesOnTripType,
  vehicleServices,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { LucideRoute } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { iconClassName } from "@/components/page/pageCommons"
import moment from "moment"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"
import {
  GridItemWrapper,
  GridWrapper,
  SectionHeaderWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"

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
        <LucideRoute className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{onTripVehicles.length}</H5Grey>
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
          <Caption>{props.brand + " " + props.model}</Caption>
          <PBold>{props.vehicleNumber}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{booking.id}</Caption>
          {booking.assignedDriver && (
            <PBold>{booking.assignedDriver.name}</PBold>
          )}
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>
            {moment(booking.startDate).format("DD MMM") +
              " - " +
              moment(booking.endDate).format("DD MMM")}
          </Caption>
          <PBold>
            {booking.source.city + " - " + booking.destination.city}
          </PBold>
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
