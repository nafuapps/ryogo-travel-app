import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { getTranslations } from "next-intl/server"

import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import { differenceInDays } from "date-fns"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { DashboardSectionHeader } from "../../dashboardCommon"

export default async function DashboardRevenueComponent({
  agencyId,
  userId,
}: {
  agencyId: string
  userId: string
}) {
  const t = await getTranslations("Dashboard.Home.Revenue")

  const revenueBookingsThisWeek =
    await bookingServices.findBookingsRevenuePreviousDays(agencyId, 7)
  const revenueBookings24Hrs = revenueBookingsThisWeek.filter(
    (b) => differenceInDays(new Date(), b.createdAt) <= 1,
  )

  const transactions =
    await transactionServices.findTransactionsPreviousDays(agencyId)

  const revenueThisWeekAmount = revenueBookingsThisWeek.reduce(
    (total, booking) => {
      return total + booking.totalAmount
    },
    0,
  )

  const revenue24HrsAmount = revenueBookings24Hrs.reduce((total, booking) => {
    return total + booking.totalAmount
  }, 0)

  const revenueWeeklyAvg = revenueThisWeekAmount / 7

  const more = revenue24HrsAmount > revenueWeeklyAvg
  const revenueChange = more
    ? (revenue24HrsAmount - revenueWeeklyAvg) / revenueWeeklyAvg
    : (revenueWeeklyAvg - revenue24HrsAmount) / revenueWeeklyAvg

  const avgCommisionRateThisWeek =
    revenueBookingsThisWeek.reduce((total, booking) => {
      return total + booking.commissionRate
    }, 0) /
    (revenueBookingsThisWeek.length * 100)

  const transactionsInAmount = transactions
    .filter((transaction) => transaction.type === TransactionTypesEnum.CREDIT)
    .reduce((total, transaction) => {
      return total + transaction.amount
    }, 0)

  const transactionsOutAmount = transactions
    .filter((transaction) => transaction.type === TransactionTypesEnum.DEBIT)
    .reduce((total, transaction) => {
      return total + transaction.amount
    }, 0)

  return (
    <SectionWrapper id="DashboardRevenue">
      <DashboardSectionHeader title={t("Title")} />
    </SectionWrapper>
  )
}
