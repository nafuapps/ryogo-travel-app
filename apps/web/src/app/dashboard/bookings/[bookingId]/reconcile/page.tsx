import DashboardHeader from "@/components/header/dashboardHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import {
  BookingStatusEnum,
  SubscriptionPlanEnum,
  UserRolesEnum,
} from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import ReconcileBookingPageComponent from "./reconcileBooking"
import { Metadata } from "next"
import { MainWrapper, SectionWrapper } from "@/components/page/pageWrappers"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { APP_TRIAL_MODE } from "@/lib/uiConfig"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { Hourglass } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { RyogoH4, RyogoSmall } from "@/components/typography"
import Link from "next/link"
import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"

export const metadata: Metadata = {
  title: `Reconcile Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function ReconcileBookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const agency = await agencyServices.findAgencyById(currentUser.agencyId)
  if (!agency) {
    redirect("/auth/login", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingDetailsById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  //Only owner can reconcile booking (which must be in completed state)
  if (
    currentUser.userRole !== UserRolesEnum.OWNER ||
    booking.status !== BookingStatusEnum.COMPLETED ||
    booking.isReconciled
  ) {
    redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
  }

  //SUBSCRIPTION BLOCKER: Only premium agencies can reconcile booking
  const isBasic = agency.subscriptionPlan === SubscriptionPlanEnum.BASIC
  if (
    !APP_TRIAL_MODE &&
    (isBasic || agency.subscriptionExpiresOn < new Date())
  ) {
    const t = await getTranslations("Dashboard.ReconcileBooking")
    return (
      <MainWrapper>
        <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
        <SectionWrapper id="ReconcileBlocker" center>
          <RyogoEnclosedIcon
            icon={Hourglass}
            size="md"
            color="yellow"
            bgColor="yellow"
          />
          <RyogoSmall color="yellow">
            {isBasic
              ? t("ReconcileTrialWarning")
              : t("ReconcileExpiredWarning")}
          </RyogoSmall>
          <RyogoH4>
            {isBasic ? t("ReconcileTrialAction") : t("ReconcileExpiredAction")}
          </RyogoH4>
          <Link href="/dashboard/account/subscription">
            <RyogoBrandButton
              size={"lg"}
              label={
                isBasic
                  ? agency.hasTriedSubscription
                    ? t("BuyCTA")
                    : t("TryCTA")
                  : t("RenewCTA")
              }
            />
          </Link>
        </SectionWrapper>
      </MainWrapper>
    )
  }

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/reconcile"} />
      <ReconcileBookingPageComponent booking={booking} />
    </MainWrapper>
  )
}
