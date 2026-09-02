import {
  bookingServices,
  FindAccountableBookingsPreviousDaysType,
} from "@ryogo-travel-app/api/services/booking.services"
import { getTranslations } from "next-intl/server"
import { differenceInDays } from "date-fns"
import { SectionWrapper } from "@/components/page/pageWrappers"
import {
  DashboardRow,
  DashboardRowHeader,
  DashboardSectionHeader,
} from "@/components/flows/dashboard/dashboardCommon"
import DashboardRevenueItemComponent from "./dashboardRevenueItemComponent"

export default async function DashboardRevenueComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.Revenue")

  //30 Days
  const revenueBookings30Days =
    await bookingServices.findAccountableBookingsPreviousDays(agencyId, 30)

  const revenue30DaysAmount = calculateTotalAmount(revenueBookings30Days)
  const commission30DaysAmount = calculateCommissionAmount(
    revenueBookings30Days,
  )

  //7 Days
  const revenueBookings7Days = revenueBookings30Days.filter(
    (b) => differenceInDays(new Date(), b.createdAt) <= 7,
  )
  const revenue7DaysAmount = calculateTotalAmount(revenueBookings7Days)
  const commission7DaysAmount = calculateCommissionAmount(revenueBookings7Days)

  //24 Hrs
  const revenueBookings24Hrs = revenueBookings7Days.filter(
    (b) => differenceInDays(new Date(), b.createdAt) <= 1,
  )
  const revenue24HrsAmount = calculateTotalAmount(revenueBookings24Hrs)
  const commission24HrsAmount = calculateCommissionAmount(revenueBookings24Hrs)

  return (
    <SectionWrapper id="DashboardRevenue">
      <DashboardSectionHeader title={t("Title")} />
      <DashboardRow>
        <DashboardRowHeader
          title={t("30Days")}
          count={revenueBookings30Days.length}
        />
        <DashboardRevenueItemComponent
          label={t("Revenue")}
          amount={revenue30DaysAmount}
        />
        <DashboardRevenueItemComponent
          label={t("Commission")}
          amount={commission30DaysAmount}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardRowHeader
          title={t("7Days")}
          count={revenueBookings7Days.length}
        />
        <DashboardRevenueItemComponent
          label={t("Revenue")}
          amount={revenue7DaysAmount}
        />
        <DashboardRevenueItemComponent
          label={t("Commission")}
          amount={commission7DaysAmount}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardRowHeader
          title={t("24Hrs")}
          count={revenueBookings24Hrs.length}
        />
        <DashboardRevenueItemComponent
          label={t("Revenue")}
          amount={revenue24HrsAmount}
        />
        <DashboardRevenueItemComponent
          label={t("Commission")}
          amount={commission24HrsAmount}
        />
      </DashboardRow>
    </SectionWrapper>
  )
}

function calculateTotalAmount(
  bookings: FindAccountableBookingsPreviousDaysType,
) {
  if (bookings.length < 1) return 0
  return bookings.reduce((total, booking) => {
    return total + (booking.actualTotalAmount ?? booking.estimatedTotalAmount)
  }, 0)
}

function calculateCommissionAmount(
  bookings: FindAccountableBookingsPreviousDaysType,
) {
  if (bookings.length < 1) return 0
  return bookings.reduce((total, booking) => {
    return (
      total +
      (booking.actualCommissionAmount ?? booking.estimatedCommissionAmount)
    )
  }, 0)
}
