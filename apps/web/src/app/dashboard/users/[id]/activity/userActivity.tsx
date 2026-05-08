import { FindUserActivityByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import moment from "moment"
import { RyogoCaption, RyogoP, RyogoSmall } from "@/components/typography"
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
    "flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
  return (
    <PageWrapper id="UserAssignedBookingsPage">
      <UserDetailHeaderTabs selectedTab={"Activity"} id={id} />
      {bookings.length > 0 && (
        <div id="BookingActivityList" className={className}>
          <RyogoSmall weight="font-bold">{t("Bookings")}</RyogoSmall>
          {bookings.map((booking) => {
            return <BookingActivityComponent key={booking.id} {...booking} />
          })}
        </div>
      )}
      {transactions.length > 0 && (
        <div id="TransactionsActivityList" className={className}>
          <RyogoSmall weight="font-bold">{t("Transactions")}</RyogoSmall>
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
          <RyogoSmall weight="font-bold">{t("Expenses")}</RyogoSmall>
          {expenses.map((expense) => {
            return <ExpenseActivityComponent key={expense.id} {...expense} />
          })}
        </div>
      )}
      {customers.length > 0 && (
        <div id="CustomersActivityList" className={className}>
          <RyogoSmall weight="font-bold">{t("Customers")}</RyogoSmall>
          {customers.map((customer) => {
            return <CustomerActivityComponent key={customer.id} {...customer} />
          })}
        </div>
      )}
      {driverLeaves.length > 0 && (
        <div id="DriverLeavesActivityList" className={className}>
          <RyogoSmall weight="font-bold">{t("DriverLeaves")}</RyogoSmall>
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
          <RyogoSmall weight="font-bold">{t("VehicleRepairs")}</RyogoSmall>
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
          <RyogoCaption color="slate">{booking.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {booking.customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.type.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {booking.source.city + " - " + booking.destination.city}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.assignedVehicle?.vehicleNumber ?? "-"}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {booking.assignedDriver?.name ?? "-"}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {booking.status.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(booking.createdAt).fromNow()}
          </RyogoP>
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
          <RyogoCaption color="slate">{transaction.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {transaction.type.toUpperCase()}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{transaction.otherParty}</RyogoCaption>
          <RyogoP weight="font-bold"> {"₹" + transaction.amount}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {transaction.mode.toUpperCase()}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {transaction.remarks}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{transaction.bookingId}</RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(transaction.createdAt).fromNow()}
          </RyogoP>
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

function CustomerActivityComponent(
  customer: FindUserActivityByIdType["customers"][number],
) {
  return (
    <Link href={`/dashboard/customers/${customer.id}`} className="w-full">
      <GridWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{customer.id}</RyogoCaption>
          <RyogoP weight="font-bold"> {customer.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{customer.email}</RyogoCaption>
          <RyogoP weight="font-bold"> {customer.phone}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{customer.location.state}</RyogoCaption>
          <RyogoP weight="font-bold"> {customer.location.city}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">{customer.status}</RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(customer.createdAt).fromNow()}
          </RyogoP>
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
          <RyogoCaption color="slate">
            {moment(driverLeave.startDate).format("DD MMM")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(driverLeave.endDate).format("DD MMM")}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold"> {driverLeave.driver.name}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {driverLeave.isCompleted ? t("Completed") : t("Pending")}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {driverLeave.remarks}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold">
            {" "}
            {moment(driverLeave.createdAt).fromNow()}
          </RyogoP>
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
          <RyogoCaption color="slate">
            {moment(vehicleRepair.startDate).format("DD MMM")}
          </RyogoCaption>
          <RyogoP weight="font-bold">
            {" "}
            {moment(vehicleRepair.endDate).format("DD MMM")}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold">
            {" "}
            {vehicleRepair.vehicle.vehicleNumber}
          </RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoCaption color="slate">
            {vehicleRepair.isCompleted ? t("Completed") : t("Pending")}
          </RyogoCaption>
          <RyogoP weight="font-bold"> {vehicleRepair.remarks}</RyogoP>
        </GridItemWrapper>
        <GridItemWrapper>
          <RyogoP weight="font-bold">
            {" "}
            {moment(vehicleRepair.createdAt).fromNow()}
          </RyogoP>
        </GridItemWrapper>
      </GridWrapper>
    </Link>
  )
}
