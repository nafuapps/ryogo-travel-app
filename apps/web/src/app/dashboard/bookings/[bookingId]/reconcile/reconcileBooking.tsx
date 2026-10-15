import ReconcileBookingAlertButton from "@/components/buttons/alert/reconcileBookingAlertButton"
import {
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
  SectionWrapper,
  StickyActionWrapper,
  TileGridWrapper,
} from "@/components/page/pageWrappers"
import {
  RyogoCaption,
  RyogoH3,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { Separator } from "@/components/ui/separator"
import { formatIndianCurrency } from "@/lib/utils"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { TransactionTypesEnum } from "@ryogo-travel-app/db/schema"
import { CircleCheckBig } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function ReconcileBookingPageComponent({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.ReconcileBooking")

  return (
    <PageWrapper id="ReconcileBookingPage">
      <SectionColWrapper>
        <SectionRowWrapper className="items-center justify-between">
          <RyogoH3>{t("Title")}</RyogoH3>
          <HelpIconButton href="/dashboard/support/help-bookings#transactions" />
        </SectionRowWrapper>
        <RyogoSmall color="light">{t("Description")}</RyogoSmall>
      </SectionColWrapper>
      <TileGridWrapper>
        <CustomerTransactions booking={booking} />
        <DriverTransactions booking={booking} />
      </TileGridWrapper>
      <StickyActionWrapper>
        <ReconcileBookingAlertButton
          bookingId={booking.id}
          agencyId={booking.agencyId}
        />
        <Link href={`/dashboard/bookings/${booking.id}/transactions/new`}>
          <RyogoOutlineButton label={t("AddTransaction")} className="w-full" />
        </Link>
        <Link href={`/dashboard/bookings/${booking.id}/transactions`}>
          <RyogoGhostButton
            label={t("ViewAllTransactions")}
            labelColor="light"
            className="w-full"
          />
        </Link>
      </StickyActionWrapper>
    </PageWrapper>
  )
}

async function CustomerTransactions({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.ReconcileBooking")

  const bookingAmount =
    booking.actualTotalAmount ?? booking.estimatedTotalAmount
  const expenseAmount = booking.actualExpensesAmount
  const finalInvoiceAmount = booking.finalInvoiceAmount ?? bookingAmount

  const receivedFromCustomerAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.RECEIVED_PAYMENT_FROM_CUSTOMER,
  )

  const sentToCustomerAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.SENT_TO_CUSTOMER,
  )

  const driverHandedToCustomerAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.DRIVER_HANDED_TO_CUSTOMER,
  )

  const customerHandedToDriverAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.CUSTOMER_HANDED_TO_DRIVER,
  )

  const totalReceivedAmount =
    receivedFromCustomerAmount +
    customerHandedToDriverAmount -
    sentToCustomerAmount -
    driverHandedToCustomerAmount

  const pendingAmount = finalInvoiceAmount - totalReceivedAmount

  return (
    <SectionWrapper id="CustomerTransactions">
      <RyogoP weight="font-bold" color="light">
        {t("CustomerTransactions")}
      </RyogoP>
      <SectionColWrapper>
        <SectionRowWrapper className="items-center justify-between">
          <RyogoCaption color="light">{t("BookingAmount")}</RyogoCaption>
          <RyogoCaption color="slate">
            {formatIndianCurrency(bookingAmount)}
          </RyogoCaption>
        </SectionRowWrapper>
        {expenseAmount !== null && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">{t("ExpenseAmount")}</RyogoCaption>
            <RyogoCaption color="slate">
              {formatIndianCurrency(expenseAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {finalInvoiceAmount && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light" weight="font-bold">
              {t("FinalInvoiceAmount")}
            </RyogoCaption>
            <RyogoCaption color="dark" weight="font-bold">
              {formatIndianCurrency(finalInvoiceAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
      </SectionColWrapper>
      <Separator />
      <SectionColWrapper>
        {receivedFromCustomerAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">
              {t("ReceivedFromCustomer")}
            </RyogoCaption>
            <RyogoCaption color="brand">
              {formatIndianCurrency(receivedFromCustomerAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {customerHandedToDriverAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">
              {t("CustomerHandedToDriver")}
            </RyogoCaption>
            <RyogoCaption color="brand">
              {formatIndianCurrency(customerHandedToDriverAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {sentToCustomerAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">{t("SentToCustomer")}</RyogoCaption>
            <RyogoCaption color="slate">
              {formatIndianCurrency(sentToCustomerAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {driverHandedToCustomerAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">
              {t("DriverHandedToCustomer")}
            </RyogoCaption>
            <RyogoCaption color="slate">
              {formatIndianCurrency(driverHandedToCustomerAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        <SectionRowWrapper className="items-center justify-between">
          <RyogoCaption color="light" weight="font-bold">
            {t("TotalReceived")}
          </RyogoCaption>
          <RyogoCaption color="dark" weight="font-bold">
            {formatIndianCurrency(totalReceivedAmount)}
          </RyogoCaption>
        </SectionRowWrapper>
      </SectionColWrapper>
      <Separator />
      <SectionColWrapper>
        {pendingAmount === 0 ? (
          <SectionRowWrapper className="items-center justify-center p-2 lg:p-3 rounded-md bg-sky-50 dark:bg-sky-900">
            <RyogoCaption color="brand" weight="font-bold">
              {t("CustomerSettled")}
            </RyogoCaption>
            <RyogoIcon icon={CircleCheckBig} size="xs" color="brand" thick />
          </SectionRowWrapper>
        ) : pendingAmount > 0 ? (
          <SectionRowWrapper className="items-center justify-center p-2 lg:p-3 rounded-md bg-yellow-50 dark:bg-yellow-900">
            <RyogoCaption color="yellow" weight="font-bold">
              {t("PendingPayment")}
            </RyogoCaption>
            <RyogoCaption color="yellow" weight="font-bold">
              {formatIndianCurrency(pendingAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        ) : (
          <SectionRowWrapper className="items-center justify-center p-2 lg:p-3 rounded-md bg-slate-50 dark:bg-slate-700">
            <RyogoCaption color="slate" weight="font-bold">
              {t("RefundToCustomer")}
            </RyogoCaption>
            <RyogoCaption color="slate" weight="font-bold">
              {formatIndianCurrency(Math.abs(pendingAmount))}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
      </SectionColWrapper>
    </SectionWrapper>
  )
}

async function DriverTransactions({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.ReconcileBooking")

  const driverAllowance =
    booking.actualTotalDriverAllowance ?? booking.estimatedTotalDriverAllowance

  const customerHandedToDriverAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.CUSTOMER_HANDED_TO_DRIVER,
  )

  const driverHandedToCustomerAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.DRIVER_HANDED_TO_CUSTOMER,
  )

  const paidToDriverAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.PAYOUT_TO_DRIVER,
  )

  const receivedFromDriverAmount = filteredSumOfTransactions(
    booking.transactions,
    TransactionTypesEnum.RECEIVED_FROM_DRIVER,
  )

  const driverExpensesAmount = booking.expenses
    .filter((expense) => expense.isApproved && expense.isPaidByDriver)
    .reduce((acc, curr) => {
      return acc + curr.amount
    }, 0)

  const totalAmount = driverAllowance + driverExpensesAmount

  const reachedDriverAmount =
    customerHandedToDriverAmount +
    paidToDriverAmount -
    driverHandedToCustomerAmount -
    receivedFromDriverAmount

  const pendingAmount = totalAmount - reachedDriverAmount

  return (
    <SectionWrapper id="DriverTransactions">
      <RyogoP weight="font-bold" color="light">
        {t("DriverTransactions")}
      </RyogoP>
      <SectionColWrapper>
        <SectionRowWrapper className="items-center justify-between">
          <RyogoCaption color="light">{t("DriverAllowance")}</RyogoCaption>
          <RyogoCaption color="slate">
            {formatIndianCurrency(driverAllowance)}
          </RyogoCaption>
        </SectionRowWrapper>
        {driverExpensesAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">{t("DriverExpenses")}</RyogoCaption>
            <RyogoCaption color="slate">
              {formatIndianCurrency(driverExpensesAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        <SectionRowWrapper className="items-center justify-between">
          <RyogoCaption color="light" weight="font-bold">
            {t("FinalDriverPayout")}
          </RyogoCaption>
          <RyogoCaption color="dark" weight="font-bold">
            {formatIndianCurrency(totalAmount)}
          </RyogoCaption>
        </SectionRowWrapper>
      </SectionColWrapper>
      <Separator />
      <SectionColWrapper>
        {customerHandedToDriverAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">
              {t("CustomerHandedToDriver")}
            </RyogoCaption>
            <RyogoCaption color="brand">
              {formatIndianCurrency(customerHandedToDriverAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {driverHandedToCustomerAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">
              {t("DriverHandedToCustomer")}
            </RyogoCaption>
            <RyogoCaption color="slate">
              {formatIndianCurrency(driverHandedToCustomerAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {paidToDriverAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">{t("PaidToDriver")}</RyogoCaption>
            <RyogoCaption color="brand">
              {formatIndianCurrency(paidToDriverAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        {receivedFromDriverAmount > 0 && (
          <SectionRowWrapper className="items-center justify-between">
            <RyogoCaption color="light">{t("ReceivedFromDriver")}</RyogoCaption>
            <RyogoCaption color="slate">
              {formatIndianCurrency(receivedFromDriverAmount)}
            </RyogoCaption>
          </SectionRowWrapper>
        )}
        <SectionRowWrapper className="items-center justify-between">
          <RyogoCaption color="light" weight="font-bold">
            {t("ReachedDriver")}
          </RyogoCaption>
          <RyogoCaption color="dark" weight="font-bold">
            {formatIndianCurrency(reachedDriverAmount)}
          </RyogoCaption>
        </SectionRowWrapper>
      </SectionColWrapper>
      <Separator />
      {pendingAmount === 0 ? (
        <SectionRowWrapper className="items-center justify-center p-2 lg:p-3 rounded-md bg-sky-50 dark:bg-sky-900">
          <RyogoCaption color="brand" weight="font-bold">
            {t("DriverSettled")}
          </RyogoCaption>
          <RyogoIcon icon={CircleCheckBig} size="xs" color="brand" thick />
        </SectionRowWrapper>
      ) : pendingAmount > 0 ? (
        <SectionRowWrapper className="items-center justify-center p-2 lg:p-3 rounded-md bg-slate-50 dark:bg-slate-700">
          <RyogoCaption color="dark" weight="font-bold">
            {t("PendingPayoutToDriver")}
          </RyogoCaption>
          <RyogoCaption color="dark" weight="font-bold">
            {formatIndianCurrency(pendingAmount)}
          </RyogoCaption>
        </SectionRowWrapper>
      ) : (
        <SectionRowWrapper className="items-center justify-center p-2 lg:p-3 rounded-md bg-yellow-50 dark:bg-yellow-900">
          <RyogoCaption color="yellow" weight="font-bold">
            {t("CollectFromDriver")}
          </RyogoCaption>
          <RyogoCaption color="yellow" weight="font-bold">
            {formatIndianCurrency(Math.abs(pendingAmount))}
          </RyogoCaption>
        </SectionRowWrapper>
      )}
    </SectionWrapper>
  )
}

function filteredSumOfTransactions(
  transactions: NonNullable<FindBookingDetailsByIdType>["transactions"],
  type: TransactionTypesEnum,
) {
  const filteredTransactions = transactions.filter(
    (txn) => txn.type === type && txn.isApproved,
  )

  return filteredTransactions.reduce((acc, curr) => {
    return acc + curr.amount
  }, 0)
}
