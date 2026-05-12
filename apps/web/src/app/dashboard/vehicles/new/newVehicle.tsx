import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import NewVehicleForm from "./newVehicleForm"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import {
  SubscriptionPlanEnum,
  VehicleStatusEnum,
} from "@ryogo-travel-app/db/schema"
import { TRIAL_MODE, TRIAL_VEHICLE_LIMIT } from "@/lib/uiConfig"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { redirect, RedirectType } from "next/navigation"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import { Hourglass } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function NewVehiclePageComponent({
  agencyId,
  isOwner,
}: {
  agencyId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.NewVehicle")

  const vehicles = await vehicleServices.findExistingVehiclesInAgency(agencyId)

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const currentAgencyVehicles = vehicles.filter(
    (vehicle) => vehicle.status !== VehicleStatusEnum.SUSPENDED,
  ).length

  //Only allow subscribed agencies to add more than X vehicles
  if (
    !TRIAL_MODE &&
    currentAgencyVehicles >= TRIAL_VEHICLE_LIMIT &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL ||
      agency.subscriptionExpiresOn < new Date())
  ) {
    return (
      <PageWrapper id="NewVehiclePage">
        <SectionWrapper id="VehicleLimitSection" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL
              ? t("TrialWarning")
              : t("ExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>
            {agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL
              ? t("TrialAction")
              : t("ExpiredAction")}
          </RyogoH4>
          {isOwner && (
            <Link href="/dashboard/account/subscription">
              <Button variant={"brand"} size="lg">
                {agency.subscriptionPlan === SubscriptionPlanEnum.TRIAL
                  ? t("BuyCTA")
                  : t("RenewCTA")}
              </Button>
            </Link>
          )}
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="NewVehiclePage">
      <NewVehicleForm agencyId={agencyId} existingVehicles={vehicles} />
    </PageWrapper>
  )
}
