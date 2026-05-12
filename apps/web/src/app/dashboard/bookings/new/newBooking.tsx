import NewBookingForm from "./newBookingForm"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { redirect, RedirectType } from "next/navigation"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { TRIAL_MODE } from "@/lib/uiConfig"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { Hourglass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function NewBookingPageComponent({
  userId,
  agencyId,
  isOwner,
}: {
  userId: string
  agencyId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.NewBooking")

  //Get agency Data (for location and commission rate)
  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }
  //Get vehicle Data with their bookings and repairs (for available vehicles and rate per km)
  const vehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  //Get driver Data with their bookings and leaves (for available drivers and allowance per day)
  const drivers = await driverServices.findDriversByAgency(agencyId)

  const customers = await customerServices.findCustomersInAgency(agencyId)

  //Only allow subscribed agencies to create bookings
  if (!TRIAL_MODE && agency.subscriptionExpiresOn < new Date()) {
    return (
      <PageWrapper id="NewBookingPage">
        <SectionWrapper id="BookingLimitSection" center>
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
    <PageWrapper id="NewBookingPage">
      <NewBookingForm
        agency={agency}
        commissionRate={agency.defaultCommissionRate}
        vehicles={vehicles}
        drivers={drivers}
        userId={userId}
        customers={customers}
      />
    </PageWrapper>
  )
}
