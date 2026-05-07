import UserDetailHeaderTabs from "@/components/header/userDetailHeaderTabs"
import moment from "moment"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
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
          <RyogoSmall weight="font-bold">{t("Expenses")}</RyogoSmall>
          {expenses.map((expense) => {
            return <ExpenseActivityComponent key={expense.id} {...expense} />
          })}
        </div>
      )}
      {tripLogs.length > 0 && (
        <div id="TripLogsActivityList" className={className}>
          <RyogoSmall weight="font-bold">{t("TripLogs")}</RyogoSmall>
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
          <RyogoCaption color="slate">{expense.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {expense.type.toUpperCase()}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold"> {"₹" + expense.amount}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold"> {expense.remarks}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{expense.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(expense.createdAt).fromNow()}
          </RyogoP>
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
          <RyogoCaption color="slate">
            {tripLog.vehicle.vehicleNumber}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {tripLog.driver.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{tripLog.odometerReading}</RyogoCaption>
          <RyogoP weight="font-bold"> {tripLog.type.toUpperCase()}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{tripLog.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold"> {tripLog.remarks}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold">
            {" "}
            {moment(tripLog.createdAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
