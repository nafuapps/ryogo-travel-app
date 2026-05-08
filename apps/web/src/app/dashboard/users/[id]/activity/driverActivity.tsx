import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import moment from "moment"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { FindDriverActivityByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
  SectionWrapper,
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

  return (
    <PageWrapper id="UserAssignedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Activity"} id={id} />
      {expenses.length > 0 && (
        <SectionWrapper id="ExpensesActivityList">
          <RyogoSmall weight="font-bold">{t("Expenses")}</RyogoSmall>
          {expenses.map((expense) => {
            return <ExpenseActivityComponent key={expense.id} {...expense} />
          })}
        </SectionWrapper>
      )}
      {tripLogs.length > 0 && (
        <SectionWrapper id="TripLogsActivityList">
          <RyogoSmall weight="font-bold">{t("TripLogs")}</RyogoSmall>
          {tripLogs.map((tripLog) => {
            return <TripLogActivityComponent key={tripLog.id} {...tripLog} />
          })}
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}
function ExpenseActivityComponent(
  expense: FindDriverActivityByUserIdType["expenses"][number],
) {
  return (
    <Link
      href={`/dashboard/bookings/${expense.bookingId}/expenses`}
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
      href={`/dashboard/bookings/${tripLog.bookingId}/trip-logs`}
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
            {moment(tripLog.createdAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
