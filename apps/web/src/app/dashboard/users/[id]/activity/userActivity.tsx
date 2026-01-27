import { pageClassName } from "@/components/page/pageCommons"
import { FindUserActivityByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "../userDetailHeaderTabs"
import moment from "moment"
import {
  gridClassName,
  gridItemClassName,
} from "@/app/dashboard/components/pageCommons"
import { Caption, PBold, SmallBold } from "@/components/typography"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

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
    <div id="UserAssignedBookingsPage" className={pageClassName}>
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
    </div>
  )
}

function BookingActivityComponent(
  booking: FindUserActivityByIdType["bookings"][number],
) {
  return (
    <Link href={`/dashboard/bookings/${booking.id}`} className="w-full">
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{booking.id}</Caption>
          <PBold>{booking.customer.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.type.toUpperCase()}</Caption>
          <PBold>
            {booking.source.city + " - " + booking.destination.city}
          </PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.assignedVehicle?.vehicleNumber ?? "-"}</Caption>
          <PBold>{booking.assignedDriver?.name ?? "-"}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{booking.status.toUpperCase()}</Caption>
          <PBold>{moment(booking.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}

function TransactionActivityComponent(
  transaction: FindUserActivityByIdType["transactions"][number],
) {
  return (
    <Link
      href={`/dashboard/bookings/${transaction.bookingId}/transactions/${transaction.id}`}
      className="w-full"
    >
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{transaction.id}</Caption>
          <PBold>{transaction.type.toUpperCase()}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{transaction.otherParty}</Caption>
          <PBold>{"₹" + transaction.amount}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{transaction.mode.toUpperCase()}</Caption>
          <PBold>{transaction.remarks}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{transaction.bookingId}</Caption>
          <PBold>{moment(transaction.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}

function ExpenseActivityComponent(
  expense: FindUserActivityByIdType["expenses"][number],
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

function CustomerActivityComponent(
  customer: FindUserActivityByIdType["customers"][number],
) {
  return (
    <Link href={`/dashboard/customers/${customer.id}`} className="w-full">
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{customer.id}</Caption>
          <PBold>{customer.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{customer.email}</Caption>
          <PBold>{customer.phone}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{customer.location.state}</Caption>
          <PBold>{customer.location.city}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>{customer.status}</Caption>
          <PBold>{moment(customer.createdAt).fromNow()}</PBold>
        </div>
      </div>
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
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{moment(driverLeave.startDate).format("DD MMM")}</Caption>
          <PBold>{moment(driverLeave.endDate).format("DD MMM")}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{driverLeave.driver.name}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>
            {driverLeave.isCompleted ? t("Completed") : t("Pending")}
          </Caption>
          <PBold>{driverLeave.remarks}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{moment(driverLeave.createdAt).fromNow()}</PBold>
        </div>
      </div>
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
      <div className={gridClassName}>
        <div className={gridItemClassName}>
          <Caption>{moment(vehicleRepair.startDate).format("DD MMM")}</Caption>
          <PBold>{moment(vehicleRepair.endDate).format("DD MMM")}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{vehicleRepair.vehicle.vehicleNumber}</PBold>
        </div>
        <div className={gridItemClassName}>
          <Caption>
            {vehicleRepair.isCompleted ? t("Completed") : t("Pending")}
          </Caption>
          <PBold>{vehicleRepair.remarks}</PBold>
        </div>
        <div className={gridItemClassName}>
          <PBold>{moment(vehicleRepair.createdAt).fromNow()}</PBold>
        </div>
      </div>
    </Link>
  )
}
