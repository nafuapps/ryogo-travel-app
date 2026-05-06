import UserDetailHeaderTabs from "@/components/header/userDetailHeaderTabs"
import moment from "moment"
import { Caption, PBold, SmallBold } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { FindDriverActivityByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import { UrlObject } from "url"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"

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
    "flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
  return (
    <PageWrapper id="UserAssignedBookingsPage">
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
    </PageWrapper>
  )
}
function ExpenseActivityComponent(
  expense: FindDriverActivityByUserIdType["expenses"][number],
) {
  return (
    <Link
      href={
        `/dashboard/bookings/${expense.bookingId}/expenses` as unknown as UrlObject
      }
      className="w-full"
    >
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{expense.id}</Caption>
          <PBold>{expense.type.toUpperCase()}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{"₹" + expense.amount}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{expense.remarks}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{expense.bookingId}</Caption>
          <PBold>{moment(expense.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

function TripLogActivityComponent(
  tripLog: FindDriverActivityByUserIdType["tripLogs"][number],
) {
  return (
    <Link
      href={
        `/dashboard/bookings/${tripLog.bookingId}/tripLogs` as unknown as UrlObject
      }
      className="w-full"
    >
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{tripLog.vehicle.vehicleNumber}</Caption>
          <PBold>{tripLog.driver.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{tripLog.odometerReading}</Caption>
          <PBold>{tripLog.type.toUpperCase()}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{tripLog.bookingId}</Caption>
          <PBold>{tripLog.remarks}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{moment(tripLog.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
