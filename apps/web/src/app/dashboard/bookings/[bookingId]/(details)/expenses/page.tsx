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
import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import BookingExpensesPageComponent from "./bookingExpenses"

export const metadata: Metadata = {
  title: `Booking Expenses - ${pageTitle}`,
  description: pageDescription,
}

export default async function BookingExpensesPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/dashboard/bookings", RedirectType.replace)
  }

  const t = await getTranslations("Dashboard.BookingExpenses")

  //Expense can be created for confirmed, in-progress or completed bookings only
  //Only owner or assigned user can create expenses (for bookings that are not closed yet)
  const canEditExpense =
    (currentUser.userRole === UserRolesEnum.OWNER ||
      currentUser.userId === booking.assignedUserId) &&
    [
      BookingStatusEnum.CONFIRMED,
      BookingStatusEnum.IN_PROGRESS,
      BookingStatusEnum.COMPLETED,
    ].includes(booking.status) &&
    !booking.closedAt

  const bookingExpenses =
    await bookingServices.findBookingExpensesById(bookingId)

  return (
    <MainWrapper>
      <DashboardHeader pathName={"/dashboard/bookings/[id]/expenses"} />
      <BookingDetailHeaderTabs id={bookingId} selectedTab="Expenses" />
      <PageWrapper id="BookingExpensesPage">
        <BookingExpensesPageComponent
          bookingExpenses={bookingExpenses}
          canEditExpense={canEditExpense}
        />
        <StickyActionWrapper>
          {canEditExpense && (
            <Link href={`/dashboard/bookings/${bookingId}/expenses/new`}>
              <RyogoDefaultButton
                label={t("AddExpense")}
                size={"lg"}
                className="w-full"
              />
            </Link>
          )}
          {booking.closedAt && (
            <RyogoGhostButton label={t("Closed")} className="w-full" disabled />
          )}
          <HelpIconButton
            href={"/dashboard/support/help-bookings#expenses"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
