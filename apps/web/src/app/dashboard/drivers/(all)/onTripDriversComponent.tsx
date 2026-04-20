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
import {
  gridClassName,
  gridItemClassName,
  iconClassName,
  sectionClassName,
  sectionHeaderClassName,
} from "@/components/page/pageCommons"
import moment from "moment"
import { TripLogStatusPill } from "@/components/statusPills/statusPills"

export default async function OnTripDriversComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Drivers.OnTrip")
  const onTripDrivers = await driverServices.findDriversOnTrip(agencyId)

  return (
    <div id="OnTripDriversSection" className={sectionClassName}>
      <div id="OnTripDriversHeader" className={sectionHeaderClassName}>
        <LucideRoute className={iconClassName} />
        <SmallGrey>{t("Title")}</SmallGrey>
        <H5Grey>{onTripDrivers.length}</H5Grey>
      </div>
      {onTripDrivers.map((driver) => (
        <OnTripDriverComponent key={driver.id} {...driver} />
      ))}
    </div>
  )
}

function OnTripDriverComponent(props: FindDriversOnTripType[number]) {
  const booking = props.assignedBookings[0]
  if (!booking) {
    return <></>
  }
  return (
    <Link href={`/dashboard/bookings/${booking.id}`}>
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{props.phone}</Caption>
          <PBold>{props.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.id}</Caption>
          {booking.assignedVehicle && (
            <PBold>{booking.assignedVehicle.vehicleNumber}</PBold>
          )}
        </div>
        <div className={gridItemClassName}>
          <Caption>
            {moment(booking.startDate).format("DD MMM") +
              " - " +
              moment(booking.endDate).format("DD MMM")}
          </Caption>
          <PBold>
            {booking.source.city + " - " + booking.destination.city}
          </PBold>
        </div>
        {booking.tripLogs[0] && (
          <div className={gridItemClassName}>
            <TripLogStatusPill status={booking.tripLogs[0].type} />
          </div>
        )}
      </div>
    </Link>
  )
}
