import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import MyBookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/myBookingDetailHeaderTabs"
import RiderHeader from "@/components/header/riderHeader"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { readPermissions } from "@/lib/permissions"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"
import MyBookingExpensesPageComponent from "./myBookingExpenses"

export const metadata: Metadata = {
  title: `My Booking Expenses - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingExpensesPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const currentUser = await readPermissions.getAuthenticatedUser()

  const { bookingId } = await params

  const booking = await bookingServices.findBookingStatusById(bookingId)
  if (!booking) {
    redirect("/rider/myBookings", RedirectType.replace)
  }
  const t = await getTranslations("Rider.MyBookingExpenses")

  //Expense can be added for in-progress bookings only by driver
  const canAddExpense = BookingStatusEnum.IN_PROGRESS === booking.status

  const bookingExpenses =
    await bookingServices.findBookingExpensesById(bookingId)

  return (
    <MainWrapper>
      <RiderHeader pathName={"/rider/myBookings/[id]/expenses"} />
      <MyBookingDetailHeaderTabs id={bookingId} selectedTab={"Expenses"} />
      <PageWrapper id="RiderBookingExpensesPage">
        <MyBookingExpensesPageComponent
          userId={currentUser.userId}
          bookingExpenses={bookingExpenses}
        />
        <StickyActionWrapper>
          {canAddExpense && (
            <Link href={`/rider/myBookings/${bookingId}/expenses/add`}>
              <RyogoDefaultButton
                label={t("AddExpense")}
                size={"lg"}
                className="w-full"
              />
            </Link>
          )}
          <HelpIconButton
            href={"/rider/mySupport/help-bookings#expenses"}
            showLabelSmall
          />
        </StickyActionWrapper>
      </PageWrapper>
    </MainWrapper>
  )
}
