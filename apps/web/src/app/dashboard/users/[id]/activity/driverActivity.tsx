import { pageClassName } from "@/components/page/pageCommons"
import UserDetailHeaderTabs from "../userDetailHeaderTabs"
import moment from "moment"
import {
  gridClassName,
  gridItemClassName,
} from "@/app/dashboard/components/pageCommons"
import { Caption, PBold, SmallBold } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { FindDriverActivityByUserIdType } from "@ryogo-travel-app/api/services/driver.services"

export default async function DriverActivityPageComponent({
  activities,
  id,
}: {
  activities: FindDriverActivityByUserIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.UserActivity")

  const expenses = activities.expenses
  const tripLogs = activities.tripLogs
  const className =
    "flex flex-col items-start gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
  return (
    <div id="UserAssignedBookingsPage" className={pageClassName}>
      <UserDetailHeaderTabs selectedTab={"Activity"} id={id} />
      {expenses.length > 0 && (
        <div id="ExpensesActivityList" className={className}>
          <SmallBold>{t("Expenses")}</SmallBold>
          {expenses.map((expense) => {
            return <ExpenseActivityComponent key={expense.id} {...expense} />
          })}
        </div>
      )}
      {tripLogs.length > 0 && (
        <div id="TripLogsActivityList" className={className}>
          <SmallBold>{t("TripLogs")}</SmallBold>
          {tripLogs.map((tripLog) => {
            return <TripLogActivityComponent key={tripLog.id} {...tripLog} />
          })}
        </div>
      )}
    </div>
  )
}
function ExpenseActivityComponent(
  expense: FindDriverActivityByUserIdType["expenses"][number],
) {
  return (
    <Link
      href={`/dashboard/bookings/${expense.bookingId}/expenses/${expense.id}`}
      className="w-full"
    >
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{expense.id}</Caption>
          <PBold>{expense.type.toUpperCase()}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{"₹" + expense.amount}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{expense.remarks}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{expense.bookingId}</Caption>
          <PBold>{moment(expense.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}

function TripLogActivityComponent(
  tripLog: FindDriverActivityByUserIdType["tripLogs"][number],
) {
  return (
    <Link
      href={`/dashboard/bookings/${tripLog.bookingId}/tripLogs`}
      className="w-full"
    >
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{tripLog.vehicle.vehicleNumber}</Caption>
          <PBold>{tripLog.driver.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{tripLog.odometerReading}</Caption>
          <PBold>{tripLog.type.toUpperCase()}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{tripLog.bookingId}</Caption>
          <PBold>{tripLog.remarks}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{moment(tripLog.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}
