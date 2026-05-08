import {
  RyogoH3,
  RyogoH4,
  RyogoSmall,
  RyogoCaption,
} from "@/components/typography"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import { TrendingUp, BadgeIndianRupee, TrendingDown } from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  metricFirstRowClassName,
  metricHeaderClassName,
  metricItem1ClassName,
  metricItem2ClassName,
  metricItem3ClassName,
  metricMainClassName,
  metricsClassName,
  metricSecondRowClassName,
} from "./dashboardMetricsCommons"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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

  const icon = more ? (
    <RyogoIcon icon={TrendingUp} size="sm" />
  ) : (
    <RyogoIcon icon={TrendingDown} size="sm" />
  )

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
    <div id="dashboardRevenueMetrics" className={metricsClassName}>
      <div
        id="dashboardRevenueMetricsFirstCol"
        className={metricFirstRowClassName}
      >
        <div
          id="dashboardRevenueMetricsHeader"
          className={metricHeaderClassName}
        >
          <RyogoIcon icon={BadgeIndianRupee} size="sm" />
          <RyogoSmall color="slate">{t("Title")}</RyogoSmall>
        </div>
        <div
          id="dashboardRevenueMetricsConfirmed"
          className={metricMainClassName}
        >
          <RyogoH3>
            {revenue24HrsAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoH3>
          {revenueWeeklyAvg !== 0 && (
            <div className="flex flex-col lg:gap-0.5 items-center text-center">
              <div className="flex flex-row gap-1 item-center">
                {icon}
                <RyogoCaption color="light">
                  {revenueChange.toLocaleString("en-IN", {
                    style: "percent",
                    maximumFractionDigits: 1,
                  })}
                </RyogoCaption>
                <RyogoCaption color="light">
                  {more ? t("More") : t("Less")}
                </RyogoCaption>
              </div>
              <RyogoCaption color="light">{t("ThanAvg")}</RyogoCaption>
            </div>
          )}
        </div>
      </div>
      <div
        id="dashboardRevenueMetricsSecondCol"
        className={metricSecondRowClassName}
      >
        <div id="dashboardRevenueMetricsLeads" className={metricItem1ClassName}>
          <RyogoH4>
            {transactionsInAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoH4>
          <RyogoCaption color="light">{t("In")}</RyogoCaption>
        </div>
        <div
          id="dashboardRevenueMetricsInProgress"
          className={metricItem2ClassName}
        >
          <RyogoH4>
            {transactionsOutAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </RyogoH4>
          <RyogoCaption color="light">{t("Out")}</RyogoCaption>
        </div>
        <div
          id="dashboardRevenueMetricsInProgress"
          className={metricItem3ClassName + " col-span-2"}
        >
          <RyogoH3>
            {revenueBookingsThisWeek.length == 0
              ? "-"
              : avgCommisionRateThisWeek.toLocaleString("en-IN", {
                  style: "percent",
                  minimumFractionDigits: 1,
                })}
          </RyogoH3>
          <RyogoCaption color="light">{t("Commission")}</RyogoCaption>
        </div>
      </div>
    </div>
  )
}
