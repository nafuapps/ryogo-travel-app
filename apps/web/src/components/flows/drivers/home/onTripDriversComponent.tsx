import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import { FindDriversOnTripType } from "@ryogo-travel-app/api/services/driver.services"
import { Route } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import moment from "moment"
import { TripLogStatusPill } from "@/components/pills/ryogoPills"
import {
  GridItemWrapper,
  HoverGridWrapper,
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function OnTripDriversComponent({
  onTripDrivers,
}: {
  onTripDrivers: FindDriversOnTripType
}) {
  const t = await getTranslations("Dashboard.Drivers.OnTrip")

  return (
    <SectionWrapper id="OnTripDriversSection">
      <SectionRowWrapper className="items-center">
        <RyogoIcon icon={Route} size="sm" color="light" />
        <RyogoSmall color="light">{t("Title")}</RyogoSmall>
        <RyogoSmall color="light" weight="font-bold">
          {onTripDrivers.length}
        </RyogoSmall>
      </SectionRowWrapper>
      {onTripDrivers.map((driver) => (
        <OnTripDriverComponent key={driver.id} driver={driver} />
      ))}
    </SectionWrapper>
  )
}

function OnTripDriverComponent({
  driver,
}: {
  driver: FindDriversOnTripType[number]
}) {
  const booking = driver.assignedBookings[0]
  if (!booking) {
    return null
  }
  return (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <HoverGridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{driver.phone}</RyogoCaption>
          <RyogoP weight="font-bold"> {driver.name}</RyogoP>
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
      </HoverGridWrapper>
    </Link>
  )
}
