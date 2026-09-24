import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import DashboardHeader from "@/components/header/dashboardHeader"
import BookingTransactionsPageComponent from "./bookingTransactions"
import { getCurrentUser } from "@/lib/auth"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import BookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/bookingDetailHeaderTabs"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

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

  //Txn can be created for in-progress or completed bookings only
  //Only owner or assigned user can create transactions
  const canCreateTransaction =
    (currentUser.userRole === UserRolesEnum.OWNER ||
      currentUser.userId === booking.assignedUserId) &&
    [BookingStatusEnum.IN_PROGRESS, BookingStatusEnum.COMPLETED].includes(
      booking.status,
    )

  const bookingTransactions =
    await bookingServices.findBookingTransactionsById(bookingId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/transactions"} />
      <PageWrapper id="BookingTransactionsPage">
        <BookingDetailHeaderTabs id={bookingId} selectedTab="Transactions" />
        <BookingTransactionsPageComponent
          bookingTransactions={bookingTransactions}
          canCreateTransaction={canCreateTransaction}
          isOwner={currentUser.userRole === UserRolesEnum.OWNER}
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
          <HelpIconButton
            href={"/dashboard/support/help-bookings#transactions"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
