import { H4, CaptionGrey, H3, H5, PGrey } from "@/components/typography";
import { getCurrentUser } from "@/lib/auth";
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services";
import { transactionServices } from "@ryogo-travel-app/api/services/transaction.services";
import {
  LucideTrendingUp,
  LucideTrendingDown,
  LucideBadgeIndianRupee,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DashboardRevenueMetricsComponent() {
  const t = await getTranslations("Dashboard.Home.RevenueMetrics");
  const user = await getCurrentUser();

  // const revenueBookingsThisWeek =
  //   await bookingServices.findBookingsRevenuePreviousDays(user!.agencyId, 7);
  // const revenueBookings24Hrs = revenueBookingsThisWeek.filter((b) => b.createdAt > new Date(new Date().getTime() - 24 * 60 * 60 * 1000))

  // const transactions = await transactionServices.getTransactionsPreviousDays(
  //   user!.agencyId
  // );

  // const revenueThisWeekAmount = revenueBookingsThisWeek.reduce((total, booking) => {
  //   return total + booking.totalAmount;
  // }, 0);

  // const revenue24HrsAmount = revenueBookings24Hrs.reduce((total, booking) => {
  //   return total + booking.totalAmount;
  // }, 0);

  const revenueThisWeekAmount = 265203;
  const revenue24HrsAmount = 65203;

  const revenueWeeklyAvg = revenueThisWeekAmount / 7;

  const more = revenue24HrsAmount > revenueWeeklyAvg;
  const revenueChange = more
    ? (revenue24HrsAmount - revenueWeeklyAvg) / revenueWeeklyAvg
    : (revenueWeeklyAvg - revenue24HrsAmount) / revenueWeeklyAvg;

  const icon = more ? (
    <LucideTrendingUp className="text-slate-500 size-4 lg:size-5" />
  ) : (
    <LucideTrendingDown className="text-slate-500 size-4 lg:size-5" />
  );

  // const avgCommisionRateThisWeek = revenueBookingsThisWeek.reduce((total, booking) => {
  //   return total + booking.commissionRate
  // },0)/7;
  const avgCommisionRateThisWeek = 0.143;

  // const transactionsInAmount = transactions
  //   .filter((transaction) => transaction.type === "credit")
  //   .reduce((total, transaction) => {
  //     return total + transaction.amount;
  //   }, 0);
  const transactionsInAmount = 23123;

  // const transactionsOutAmount = transactions
  //   .filter((transaction) => transaction.type === "debit")
  //   .reduce((total, transaction) => {
  //     return total + transaction.amount;
  //   }, 0);
  const transactionsOutAmount = 14982;

  return (
    <div
      id="dashboardRevenueMetrics"
      className="bg-white rounded-lg grid grid-cols-5 p-4 lg:p-5 gap-2 lg:gap-3"
    >
      <div
        id="dashboardRevenueMetricsFirstCol"
        className="flex flex-col justify-start col-span-2 items-center gap-4 lg:gap-5"
      >
        <div
          id="dashboardRevenueMetricsHeader"
          className="flex flex-row gap-2 items-center self-start"
        >
          <LucideBadgeIndianRupee className="text-slate-500 stroke-1 size-4 lg:size-5" />
          <PGrey>{t("Title")}</PGrey>
        </div>
        <div
          id="dashboardRevenueMetricsConfirmed"
          className="flex flex-col flex-1 gap-3 lg:gap-4 items-center justify-center"
        >
          <H3>
            {revenue24HrsAmount.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            })}
          </H3>
          <div className="flex flex-col lg:gap-0.5 items-center text-center">
            <div className="flex flex-row gap-1 item-center">
              {icon}
              <CaptionGrey>
                {revenueChange.toLocaleString("en-IN", {
                  style: "percent",
                  minimumFractionDigits: 1,
                })}
              </CaptionGrey>
              <CaptionGrey>{more ? t("More") : t("Less")}</CaptionGrey>
            </div>
            <CaptionGrey>{t("ThanAvg")}</CaptionGrey>
          </div>
        </div>
      </div>
      <div
        id="dashboardRevenueMetricsSecondCol"
        className="grid grid-rows-2 grid-cols-2 col-span-3"
      >
        <div
          id="dashboardRevenueMetricsLeads"
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-r border-slate-100"
        >
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
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center"
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
          className="flex flex-col gap-0.5 lg:gap-1 p-1.5 lg:p-2 items-center justify-center border-t border-slate-100 col-span-2"
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
  );
}
