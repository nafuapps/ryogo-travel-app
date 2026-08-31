import NewBookingForm from "./newBookingForm"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { vehicleServices } from "@ryogo-travel-app/api/services/vehicle.services"
import { driverServices } from "@ryogo-travel-app/api/services/driver.services"
import { redirect, RedirectType } from "next/navigation"
import { PageWrapper } from "@/components/page/pageWrappers"
import {
  BASIC_PLAN_AGENT_LIMIT,
  BASIC_PLAN_DRIVER_LIMIT,
  APP_TRIAL_MODE,
  BASIC_PLAN_VEHICLE_LIMIT,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT,
  BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
} from "@/lib/uiConfig"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { SubscriptionPlanEnum } from "@ryogo-travel-app/db/schema"
import { getTranslations } from "next-intl/server"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { differenceInDays } from "date-fns"
import SubscriptionBlockerSection from "@/components/flows/susbcription/subscriptionBlockerSection"

export default async function NewBookingWithCustomerPageComponent({
  userId,
  agencyId,
  isOwner,
  customerId,
}: {
  userId: string
  agencyId: string
  isOwner: boolean
  customerId: string
}) {
  const t = await getTranslations("Dashboard.NewBookingWithCustomer")

  const agency = await agencyServices.findAgencyById(agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC

  //Find last X days confirmed bookings
  const confirmedBookings =
    await bookingServices.findAccountableBookingsPreviousDays(
      agencyId,
      BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS,
    )

  //SUBSCRIPTION BLOCKER: Monthly booking limit reached
  if (
    !APP_TRIAL_MODE &&
    confirmedBookings.length >= BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_LIMIT &&
    (isBasic ||
      //Check if premium expired more than X days ago
      differenceInDays(new Date(), agency.subscriptionExpiresOn) >
        BASIC_PLAN_WEEKLY_CONFIRMED_BOOKINGS_ROLLOVER_WINDOW_DAYS)
  ) {
    return (
      <PageWrapper id="NewBookingLimitBlockerPage">
        <SubscriptionBlockerSection
          warningText={
            isBasic ? t("BookingTrialWarning") : t("BookingExpiredWarning")
          }
          actionText={
            isBasic ? t("BookingTrialAction") : t("BookingExpiredAction")
          }
          isOwner={isOwner}
          ctaLabel={
            isBasic
              ? agency.hasTriedSubscription
                ? t("BuyCTA")
                : t("TryCTA")
              : t("RenewCTA")
          }
        />
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

  //SUBSCRIPTION BLOCKER: Limited agents can creating bookings
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    if (allDashboardUsers.length > BASIC_PLAN_AGENT_LIMIT) {
      const preferredAgents = allDashboardUsers
        .sort((u1, u2) => u2.createdAt.getTime() - u1.createdAt.getTime())
        .splice(0, BASIC_PLAN_AGENT_LIMIT)
      if (!preferredAgents.find((user) => user.id === userId)) {
        return (
          <PageWrapper id="NewBookingLimitBlockerPage">
            <SubscriptionBlockerSection
              warningText={
                isBasic ? t("AgentTrialWarning") : t("AgentExpiredWarning")
              }
              actionText={
                isBasic ? t("AgentTrialAction") : t("AgentExpiredAction")
              }
              isOwner={isOwner}
              ctaLabel={
                isBasic
                  ? agency.hasTriedSubscription
                    ? t("BuyCTA")
                    : t("TryCTA")
                  : t("RenewCTA")
              }
            />
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

  return (
    <PageWrapper id="NewBookingWithCustomerPage">
      <NewBookingForm
        agency={agency}
        customerId={customerId}
        userId={userId}
        vehicles={vehicles}
        drivers={drivers}
        limited={limited}
        isSubscribed={!isBasic}
        hasTriedSubscription={agency.hasTriedSubscription}
      />
    </PageWrapper>
  )
}
