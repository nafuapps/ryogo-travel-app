import { FindUserActivityByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "@/components/header/userDetailHeaderTabs"
import moment from "moment"
import { Caption, PBold, SmallBold } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { UrlObject } from "url"
import {
  GridItemWrapper,
  GridWrapper,
  PageWrapper,
} from "@/components/page/pageWrappers"

export default async function UserActivityPageComponent({
  activities,
  id,
}: {
  activities: FindUserActivityByIdType
  id: string
}) {
  const t = await getTranslations("Dashboard.UserActivity")

  const bookings = activities.bookings
  const transactions = activities.transactions
  const expenses = activities.expenses
  const customers = activities.customers
  const driverLeaves = activities.driverLeaves
  const vehicleRepairs = activities.vehicleRepairs

  const className =
    "flex flex-col items-start gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
  return (
    <PageWrapper id="UserAssignedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Activity"} id={id} />
      {bookings.length > 0 && (
        <div id="BookingActivityList" className={className}>
          <SmallBold>{t("Bookings")}</SmallBold>
          {bookings.map((booking) => {
            return <BookingActivityComponent key={booking.id} {...booking} />
          })}
        </div>
      )}
      {transactions.length > 0 && (
        <div id="TransactionsActivityList" className={className}>
          <SmallBold>{t("Transactions")}</SmallBold>
          {transactions.map((transaction) => {
            return (
              <TransactionActivityComponent
                key={transaction.id}
                {...transaction}
              />
            )
          })}
        </div>
      )}
      {expenses.length > 0 && (
        <div id="ExpensesActivityList" className={className}>
          <SmallBold>{t("Expenses")}</SmallBold>
          {expenses.map((expense) => {
            return <ExpenseActivityComponent key={expense.id} {...expense} />
          })}
        </div>
      )}
      {customers.length > 0 && (
        <div id="CustomersActivityList" className={className}>
          <SmallBold>{t("Customers")}</SmallBold>
          {customers.map((customer) => {
            return <CustomerActivityComponent key={customer.id} {...customer} />
          })}
        </div>
      )}
      {driverLeaves.length > 0 && (
        <div id="DriverLeavesActivityList" className={className}>
          <SmallBold>{t("DriverLeaves")}</SmallBold>
          {driverLeaves.map((driverLeave) => {
            return (
              <DriverLeaveActivityComponent
                key={driverLeave.id}
                {...driverLeave}
              />
            )
          })}
        </div>
      )}
      {vehicleRepairs.length > 0 && (
        <div id="VehicleRepairsActivityList" className={className}>
          <SmallBold>{t("VehicleRepairs")}</SmallBold>
          {vehicleRepairs.map((vehicleRepair) => {
            return (
              <VehicleRepairActivityComponent
                key={vehicleRepair.id}
                {...vehicleRepair}
              />
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}

function BookingActivityComponent(
  booking: FindUserActivityByIdType["bookings"][number],
) {
  return (
    <Link href={`/dashboard/bookings/${booking.id}`} className="w-full">
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{booking.id}</Caption>
          <PBold>{booking.customer.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <PBold>
            {booking.source.city + " - " + booking.destination.city}
          </PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{booking.assignedVehicle?.vehicleNumber ?? "-"}</Caption>
          <PBold>{booking.assignedDriver?.name ?? "-"}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{booking.status.toUpperCase()}</Caption>
          <PBold>{moment(booking.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

function TransactionActivityComponent(
  transaction: FindUserActivityByIdType["transactions"][number],
) {
  return (
    <Link
      href={
        `/dashboard/bookings/${transaction.bookingId}/transactions` as unknown as UrlObject
      }
      className="w-full"
    >
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{transaction.id}</Caption>
          <PBold>{transaction.type.toUpperCase()}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{transaction.otherParty}</Caption>
          <PBold>{"₹" + transaction.amount}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{transaction.mode.toUpperCase()}</Caption>
          <PBold>{transaction.remarks}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{transaction.bookingId}</Caption>
          <PBold>{moment(transaction.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

function ExpenseActivityComponent(
  expense: FindUserActivityByIdType["expenses"][number],
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

function CustomerActivityComponent(
  customer: FindUserActivityByIdType["customers"][number],
) {
  return (
    <Link href={`/dashboard/customers/${customer.id}`} className="w-full">
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{customer.id}</Caption>
          <PBold>{customer.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{customer.email}</Caption>
          <PBold>{customer.phone}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{customer.location.state}</Caption>
          <PBold>{customer.location.city}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>{customer.status}</Caption>
          <PBold>{moment(customer.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

async function DriverLeaveActivityComponent(
  driverLeave: FindUserActivityByIdType["driverLeaves"][number],
) {
  const t = await getTranslations("Dashboard.UserActivity")
  return (
    <Link
      href={`/dashboard/drivers/${driverLeave.driverId}/leaves`}
      className="w-full"
    >
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{moment(driverLeave.startDate).format("DD MMM")}</Caption>
          <PBold>{moment(driverLeave.endDate).format("DD MMM")}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{driverLeave.driver.name}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>
            {driverLeave.isCompleted ? t("Completed") : t("Pending")}
          </Caption>
          <PBold>{driverLeave.remarks}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{moment(driverLeave.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}

async function VehicleRepairActivityComponent(
  vehicleRepair: FindUserActivityByIdType["vehicleRepairs"][number],
) {
  const t = await getTranslations("Dashboard.UserActivity")
  return (
    <Link
      href={`/dashboard/vehicles/${vehicleRepair.vehicleId}/repairs`}
      className="w-full"
    >
      <GridWrapper>
        <GridItemWrapper>
          <Caption>{moment(vehicleRepair.startDate).format("DD MMM")}</Caption>
          <PBold>{moment(vehicleRepair.endDate).format("DD MMM")}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{vehicleRepair.vehicle.vehicleNumber}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <Caption>
            {vehicleRepair.isCompleted ? t("Completed") : t("Pending")}
          </Caption>
          <PBold>{vehicleRepair.remarks}</PBold>
        </GridItemWrapper>
        <GridItemWrapper>
          <PBold>{moment(vehicleRepair.createdAt).fromNow()}</PBold>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
