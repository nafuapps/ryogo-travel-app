import {
  RyogoDefaultButton,
  RyogoGhostButton,
} from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { getCurrentUser } from "@/lib/auth"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import BookingTransactionsPageComponent from "./bookingTransactions"

export const metadata: Metadata = {
  title: `Booking Transactions - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingTransactionsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace)
  }

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const t = await getTranslations("Dashboard.BookingTransactions")

  //Txn can be created for confirmed, in-progress or completed bookings only
  //Only owner or assigned user can create  (for bookings that are not reconciled yet)
  const canCreateTransaction =
    (currentUser.userRole === UserRolesEnum.OWNER ||
      currentUser.userId === booking.assignedUserId) &&
    [
      BookingStatusEnum.CONFIRMED,
      BookingStatusEnum.IN_PROGRESS,
      BookingStatusEnum.COMPLETED,
    ].includes(booking.status) &&
    !booking.reconciledAt

  const bookingTransactions =
    await bookingServices.findBookingTransactionsById(bookingId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions"} />
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
      <PageWrapper id="BookingTransactionsPage">
        <BookingTransactionsPageComponent
          bookingTransactions={bookingTransactions}
          canCreateTransaction={canCreateTransaction}
          assignedUserId={booking.assignedUserId}
        />
        <StickyActionWrapper>
          {canCreateTransaction && (
            <Link href={`/dashboard/bookings/${bookingId}/transactions/new`}>
              <RyogoDefaultButton
                label={t("AddTransaction")}
                size={"lg"}
                className="w-full"
              />
            </Link>
          )}
          {booking.reconciledAt && (
            <RyogoGhostButton
              label={t("Reconciled")}
              className="w-full"
              disabled
            />
          )}
          <HelpIconButton
            href={"/dashboard/support/help-bookings#transactions"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
