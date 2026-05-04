import {
  Caption,
  CaptionBold,
  H5Grey,
  PBold,
  SmallGrey,
} from "@/components/typography"
import {
  FindDriversOnTripType,
  driverServices,
} from "@ryogo-travel-app/api/services/driver.services"
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

export default async function OnTripDriversComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Drivers.OnTrip")
  const onTripDrivers = await driverServices.findDriversOnTrip(agencyId)

  return (
    <SectionWrapper id="OnTripDriversSection">
      <SectionHeaderWrapper>
        <LucideRoute className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{onTripDrivers.length}</H5Grey>
      </SectionHeaderWrapper>
      {onTripDrivers.map((driver) => (
        <OnTripDriverComponent key={driver.id} {...driver} />
      ))}
    </SectionWrapper>
  )
}

function OnTripDriverComponent(props: FindDriversOnTripType[number]) {
  const booking = props.assignedBookings[0]
  if (!booking) {
    return <></>
  }
  return (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{props.phone}</Caption>
          <PBold>{props.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{booking.id}</Caption>
          {booking.assignedVehicle && (
            <PBold>{booking.assignedVehicle.vehicleNumber}</PBold>
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
