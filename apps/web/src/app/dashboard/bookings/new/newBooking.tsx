import NewBookingForm from "./newBookingForm"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { customerServices } from "@ryogo-travel-app/api/services/customer.services"
import { redirect, RedirectType } from "next/navigation"
import { PageWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import {
  BASIC_PLAN_AGENT_LIMIT,
  BASIC_PLAN_DRIVER_LIMIT,
  TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
  BASIC_PLAN_MONTHLY_CONFIRMED_BOOKINGS_LIMIT,
  BOOKINGS_ROLLOVER_DAYS,
} from "@/lib/uiConfig"
import { RyogoSmall, RyogoH4 } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { Hourglass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { differenceInDays } from "date-fns"

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

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  //Find last X days confirmed bookings
  const bookings = await bookingServices.findSubscriptionBookingsPreviousDays(
    agencyId,
    BOOKINGS_ROLLOVER_DAYS,
  )

  if (
    !TRIAL_MODE &&
    bookings.length >= BASIC_PLAN_MONTHLY_CONFIRMED_BOOKINGS_LIMIT &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      //Check if premium expired more than X days ago
      differenceInDays(new Date(), agency.subscriptionExpiresOn) >
        BOOKINGS_ROLLOVER_DAYS)
  ) {
    //SUBSCRIPTION BLOCKER: Monthly booking limit reached
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
            {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
              ? t("BookingTrialWarning")
              : t("BookingExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>
            {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
              ? t("BookingTrialAction")
              : t("BookingExpiredAction")}
          </RyogoH4>
          {isOwner && (
            <Link href="/dashboard/account/subscription">
              <Button variant={"brand"} size="lg">
                {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
                  ? t("BuyCTA")
                  : t("RenewCTA")}
              </Button>
            </Link>
          )}
        </SectionWrapper>
      </PageWrapper>
    )
  }

  //Get vehicle Data with their bookings and repairs
  let vehicles = await vehicleServices.findVehiclesByAgency(agencyId)

  //Get driver Data with their bookings and leaves
  let drivers = await driverServices.findDriversByAgency(agencyId)

  const allDashboardUsers =
    await userServices.findOwnerAndAgentsByAgency(agencyId)

  let limited = false

  if (
    !TRIAL_MODE &&
    (agency.subscriptionPlan === SubscriptionPlanEnum.BASIC ||
      agency.subscriptionExpiresOn < new Date())
  ) {
    //SUBSCRIPTION BLOCKER: Limited agents can creating bookings
    if (allDashboardUsers.length > BASIC_PLAN_AGENT_LIMIT) {
      const preferredAgents = allDashboardUsers
        .sort((u1, u2) => u2.createdAt.getTime() - u1.createdAt.getTime())
        .splice(0, BASIC_PLAN_AGENT_LIMIT)
      if (!preferredAgents.find((user) => user.id === userId)) {
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
                {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
                  ? t("AgentTrialWarning")
                  : t("AgentExpiredWarning")}
              </RyogoSmall>
              <RyogoH4>
                {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
                  ? t("AgentTrialAction")
                  : t("AgentExpiredAction")}
              </RyogoH4>
              {isOwner && (
                <Link href="/dashboard/account/subscription">
                  <Button variant={"brand"} size="lg">
                    {agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
                      ? t("BuyCTA")
                      : t("RenewCTA")}
                  </Button>
                </Link>
              )}
            </SectionWrapper>
          </PageWrapper>
        )
      }
    }
    //SUBSCRIPTION BLOCKER: Limited vehicles and drivers available for assignment
    limited = true
    vehicles = vehicles
      .sort((v1, v2) => v2.createdAt.getTime() - v1.createdAt.getTime())
      .slice(0, BASIC_PLAN_VEHICLE_LIMIT)
    drivers = drivers
      .sort((d1, d2) => d2.createdAt.getTime() - d1.createdAt.getTime())
      .slice(0, BASIC_PLAN_DRIVER_LIMIT)
  }

  //Get customer data
  const customers = await customerServices.findCustomersInAgency(agencyId)

  return (
    <PageWrapper id="NewBookingPage">
      <NewBookingForm
        agency={agency}
        commissionRate={agency.defaultCommissionRate}
        vehicles={vehicles}
        drivers={drivers}
        userId={userId}
        customers={customers}
        limited={limited}
        isSubscribed={agency.subscriptionPlan !== SubscriptionPlanEnum.BASIC}
      />
    </PageWrapper>
  )
}
