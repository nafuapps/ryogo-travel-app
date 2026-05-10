import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { TrendingUp, BadgeIndianRupee, TrendingDown } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  DashboardMetricGridItem,
  DashboardMetricGridWrapper,
  DashboardMetricHeader,
  DashboardMetricMain,
  DashboardMetricSubTitle,
  DashboardMetricTopWrapper,
  DashboardMetricWrapper,
} from "./dashboardMetricsWrappers"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"

export default async function DashboardRevenueMetricsComponent({
  agencyId,
}: {
  agencyId: string
}) {
  const t = await getTranslations("Dashboard.Home.RevenueMetrics")

  const revenueBookingsThisWeek =
    await bookingServices.findBookingsRevenuePreviousDays(agencyId, 7)
  const revenueBookings24Hrs = revenueBookingsThisWeek.filter(
    (b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
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
    <DashboardMetricWrapper>
      <DashboardMetricTopWrapper>
        <DashboardMetricHeader label={t("Title")} icon={BadgeIndianRupee} />
        <DashboardMetricMain
          mainValue={revenue24HrsAmount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          })}
        >
          {revenueWeeklyAvg !== 0 && (
            <DashboardMetricSubTitle
              icon={more ? TrendingUp : TrendingDown}
              subtitle={t("Subtitle", {
                revenueChange: revenueChange.toLocaleString("en-IN", {
                  style: "percent",
                  maximumFractionDigits: 1,
                }),
                more: more ? "more" : "less",
              })}
            />
          )}
        </DashboardMetricMain>
      </DashboardMetricTopWrapper>
      <DashboardMetricGridWrapper>
        <DashboardMetricGridItem
          label={t("In")}
          value={transactionsInAmount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          })}
          borderBottom
        />
        <DashboardMetricGridItem
          label={t("Out")}
          value={transactionsOutAmount.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
          })}
          borderLeft
          borderBottom
        />
        <DashboardMetricGridItem
          label={t("Commission")}
          value={
            revenueBookingsThisWeek.length == 0
              ? "-"
              : avgCommisionRateThisWeek.toLocaleString("en-IN", {
                  style: "percent",
                  minimumFractionDigits: 1,
                })
          }
          spanTwo
        />
      </DashboardMetricGridWrapper>
    </DashboardMetricWrapper>
  )
}
