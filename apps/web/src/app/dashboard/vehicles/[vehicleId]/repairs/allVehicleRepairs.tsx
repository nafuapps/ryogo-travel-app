"use client"

import {
  FindAllVehicleRepairsByVehicleIdType,
  FindVehicleDetailsByIdType,
} from "@ryogo-travel-app/api/services/vehicle.services"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Wrench, WrenchOff } from "lucide-react"
import {
  PageWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import VehicleRepairComponent from "@/components/flows/vehicles/repairs/vehicleRepairComponent"
import { useSearchParams } from "next/navigation"
import { VehicleRepairStatusEnum } from "@ryogo-travel-app/db/schema"
import VehicleRepairsFilterSelect from "@/components/flows/vehicles/repairs/vehicleRepairsFilter"

export default function AllVehicleRepairsPageComponent({
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
  const t = useTranslations("Dashboard.VehicleRepairs")

  const searchParams = useSearchParams()
  const status = searchParams.get("status") as VehicleRepairStatusEnum

  const filteredRepairs = status
    ? repairs.filter((repair) => repair.status === status)
    : repairs

  return (
    <PageWrapper id="VehicleRepairsPage">
      <SectionRowWrapper className="items-center justify-between">
        <SectionHeaderWrapper
          icon={Wrench}
          label={t("Title")}
          count={filteredRepairs.length}
        />
        <VehicleRepairsFilterSelect />
      </SectionRowWrapper>
      {filteredRepairs.length > 0 ? (
        filteredRepairs.map((repair) => (
          <VehicleRepairComponent
            key={repair.id}
            repair={repair}
            canModify={isOwner || curentUserId === repair.addedByUserId}
            vehicle={vehicle}
          />
        ))
      ) : (
        <EmptyStateIcon icon={WrenchOff} label={t("NoRepairs")} />
      )}
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
