import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import { getCurrentUser } from "@/lib/auth"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { redirect, RedirectType } from "next/navigation"
import { Metadata } from "next"
import {
  MainWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import MyBookingExpensesPageComponent from "./myBookingExpenses"
import RiderHeader from "@/components/header/riderHeader"
import MyBookingDetailHeaderTabs from "@/components/header/detailHeaderTabs/myBookingDetailHeaderTabs"
import Link from "next/link"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { getTranslations } from "next-intl/server"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export const metadata: Metadata = {
  title: `My Booking Expenses - ${pageTitle}`,
  description: pageDescription,
}

export default async function MyBookingExpensesPage({
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
      <PageWrapper id="RiderBookingExpensesPage">
        <MyBookingDetailHeaderTabs id={bookingId} selectedTab={"Expenses"} />
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
