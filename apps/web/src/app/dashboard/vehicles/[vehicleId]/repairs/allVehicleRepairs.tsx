import {
  FindAllVehicleRepairsByVehicleIdType,
  FindVehicleDetailsByIdType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Wrench, WrenchOff } from "lucide-react"
import {
  SectionWrapper,
  PageWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import VehicleRepairComponent from "@/components/flows/vehicles/repairs/vehicleRepairComponent"

export default async function AllVehicleRepairsPageComponent({
  repairs,
  vehicle,
  curentUserId,
  isOwner,
}: {
  repairs: FindAllVehicleRepairsByVehicleIdType
  vehicle: NonNullable<FindVehicleDetailsByIdType>
  curentUserId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.VehicleRepairs")

  return (
    <PageWrapper id="VehicleRepairsPage">
      <SectionWrapper id="VehicleRepairsList">
        <SectionHeaderWrapper
          icon={Wrench}
          label={t("Title")}
          count={repairs.length}
        />
        {repairs.length > 0 ? (
          <TileGridWrapper>
            {repairs.map((repair) => (
              <VehicleRepairComponent
                key={repair.id}
                repair={repair}
                canModify={isOwner || curentUserId === repair.addedByUserId}
                vehicle={vehicle}
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={WrenchOff} label={t("NoRepairs")} />
        )}
      </SectionWrapper>
      <StickyActionWrapper>
        <Link
          href={`/dashboard/vehicles/${vehicle.id}/repairs/new`}
          className="w-full"
        >
          <RyogoDefaultButton label={t("AddRepair")} className="w-full" />
        </Link>
        <HelpIconButton
          href={"/dashboard/support/help-vehicles#repairs"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
