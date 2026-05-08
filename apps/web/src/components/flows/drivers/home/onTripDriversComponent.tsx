import {
  RyogoCaption,
  RyogoH4,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import {
  FindDriversOnTripType,
  driverServices,
} from "@ryogo-travel-app/api/services/driver.services"
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
        <RyogoIcon icon={Route} size="sm" />
        <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        <RyogoH4 color="slate"> {onTripDrivers.length}</RyogoH4>
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
          <RyogoCaption color="slate">{props.phone}</RyogoCaption>
          <RyogoP weight="font-bold"> {props.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{booking.id}</RyogoCaption>
          {booking.assignedVehicle && (
            <RyogoP weight="font-bold">
              {booking.assignedVehicle.vehicleNumber}
            </RyogoP>
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
