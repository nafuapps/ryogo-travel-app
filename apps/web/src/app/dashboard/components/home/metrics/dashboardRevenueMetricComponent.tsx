import { H4, CaptionGrey, H3, H5, SmallGrey } from "@/components/typography"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services"
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideBadgeIndianRupee,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import {
  boldIconClassName,
  iconClassName,
  metricFirstColClassName,
  metricHeaderClassName,
  metricItem1ClassName,
  metricItem2ClassName,
  metricItem3ClassName,
  metricMainClassName,
  metricsClassName,
  metricSecondColClassName,
} from "./dashboardMetricsCommons"
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

  const icon = more ? (
    <LucideTrendingUp className={boldIconClassName} />
  ) : (
    <LucideTrendingDown className={boldIconClassName} />
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
        className={metricFirstColClassName}
      >
        <div
          id="dashboardRevenueMetricsHeader"
          className={metricHeaderClassName}
        >
          <LucideBadgeIndianRupee className={iconClassName} />
          <SmallGrey>{t("Title")}</SmallGrey>
        </div>
        <div
          id="dashboardRevenueMetricsConfirmed"
          className={metricMainClassName}
        >
          <H3>
            {revenue24HrsAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </H3>
          {revenueWeeklyAvg !== 0 && (
            <div className="flex flex-col lg:gap-0.5 items-center text-center">
              <div className="flex flex-row gap-1 item-center">
                {icon}
                <CaptionGrey>
                  {revenueChange.toLocaleString("en-IN", {
                    style: "percent",
                    maximumFractionDigits: 1,
                  })}
                </CaptionGrey>
                <CaptionGrey>{more ? t("More") : t("Less")}</CaptionGrey>
              </div>
              <CaptionGrey>{t("ThanAvg")}</CaptionGrey>
            </div>
          )}
        </div>
      </div>
      <div
        id="dashboardRevenueMetricsSecondCol"
        className={metricSecondColClassName}
      >
        <div id="dashboardRevenueMetricsLeads" className={metricItem1ClassName}>
          <H5>
            {transactionsInAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </H5>
          <CaptionGrey>{t("In")}</CaptionGrey>
        </div>
        <div
          id="dashboardRevenueMetricsInProgress"
          className={metricItem2ClassName}
        >
          <H5>
            {transactionsOutAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </H5>
          <CaptionGrey>{t("Out")}</CaptionGrey>
        </div>
        <div
          id="dashboardRevenueMetricsInProgress"
          className={metricItem3ClassName + " col-span-2"}
        >
          <H4>
            {avgCommisionRateThisWeek.toLocaleString("en-IN", {
              style: "percent",
              minimumFractionDigits: 1,
            })}
          </H4>
          <CaptionGrey>{t("Commission")}</CaptionGrey>
        </div>
      </div>
    </div>
  )
}
