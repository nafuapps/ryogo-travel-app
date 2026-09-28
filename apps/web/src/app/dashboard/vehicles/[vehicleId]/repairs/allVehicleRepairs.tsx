import { FindAllVehicleRepairsByVehicleIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"
import { RyogoSmall } from "@/components/typography"
import Link from "next/link"
import {
  ChevronRight,
  MessageSquareQuote,
  Wrench,
  WrenchOff,
} from "lucide-react"
import {
  SectionWrapper,
  PageWrapper,
  TileGridWrapper,
  SectionHeaderWrapper,
  StickyActionWrapper,
  SectionRowWrapper,
  DateWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RepairStatusPill } from "@/components/pills/ryogoPills"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { differenceInDays } from "date-fns"
import RyogoTag from "@/components/tags/ryogoTag"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import RyogoRoundedDashedTag from "@/components/tags/ryogoRoundedDashedTag"

export default async function AllVehicleRepairsPageComponent({
  repairs,
  vehicleId,
  userId,
  isOwner,
}: {
  repairs: FindAllVehicleRepairsByVehicleIdType
  vehicleId: string
  userId: string
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
                isOwner={isOwner}
                userId={userId}
              />
            ))}
          </TileGridWrapper>
        ) : (
          <EmptyStateIcon icon={WrenchOff} label={t("NoRepairs")} />
        )}
      </SectionWrapper>
      {/* <SectionWrapper  id="RepairSchedule">
        //TODO: Add repair schedule chart
      </SectionWrapper> */}
      <StickyActionWrapper>
        <Link
          href={`/dashboard/vehicles/${vehicleId}/repairs/new`}
          className="w-full"
        >
          <RyogoDefaultButton
            label={t("AddRepair")}
            size="lg"
            className="w-full"
          />
        </Link>
        <HelpIconButton
          href={"/dashboard/support/help-vehicles#repairs"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}

async function VehicleRepairComponent({
  repair,
  userId,
  isOwner,
}: {
  repair: FindAllVehicleRepairsByVehicleIdType[number]
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.VehicleRepairs")

  const canModify = isOwner || userId === repair.addedByUserId

  return (
    <SectionColWrapper className="w-full p-4 lg:p-5 border rounded-md">
      <SectionRowWrapper className="items-center justify-between">
        <DateWrapper date={repair.startDate} hideYear />
        <SectionColWrapper small className="w-full items-center">
          {repair.cost !== null && repair.cost > 0 && (
            <RyogoSmall color="slate">
              {t("Cost", { cost: repair.cost })}
            </RyogoSmall>
          )}
          <RyogoRoundedDashedTag
            label={t("Days", {
              days: differenceInDays(repair.endDate, repair.startDate) + 1,
            })}
          />
        </SectionColWrapper>
        <DateWrapper date={repair.endDate} hideYear />
      </SectionRowWrapper>
      {repair.remarks && (
        <RyogoTag label={repair.remarks} icon={MessageSquareQuote} />
      )}
      <RepairStatusPill
        status={repair.isCompleted ? t("Completed") : t("Pending")}
        completed={repair.isCompleted}
      />
      <SectionRowWrapper className="items-center justify-between">
        <RyogoImageIconTag
          url={repair.addedByUser.photoUrl}
          label={repair.addedByUser.name}
          subtitle={repair.addedByUser.userRole}
        />
        {canModify && (
          <Link
            href={`/dashboard/vehicles/${repair.vehicleId}/repairs/modify/${repair.id}`}
          >
            <RyogoOutlineButton label={t("Edit")}>
              <RyogoIcon icon={ChevronRight} size="sm" />
            </RyogoOutlineButton>
          </Link>
        )}
      </SectionRowWrapper>
    </SectionColWrapper>
  )
}
