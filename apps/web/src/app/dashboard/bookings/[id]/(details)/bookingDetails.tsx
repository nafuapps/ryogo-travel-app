"use client"

import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import BookingDetailHeaderTabs from "./bookingDetailHeaderTabs"
import { P, CaptionGrey, SmallBold } from "@/components/typography"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import moment from "moment"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
import { JSX, useState, useTransition } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { cancelBookingAction } from "@/app/dashboard/components/actions/cancelBookingAction"
import { toast } from "sonner"
import { redirect, RedirectType } from "next/navigation"
import { sendInvoiceAction } from "@/app/dashboard/components/actions/sendInvoiceAction"

export default function BookingDetailsPageComponent({
  bookingId,
  bookingDetails,
  isOwner,
  isAssignedUser,
  children,
}: {
  bookingId: string
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
  isOwner: boolean
  isAssignedUser: boolean
  children: React.ReactNode
}) {
  const t = useTranslations("Dashboard.BookingDetails")

  const [isCancelPending, startCancelTransition] = useTransition()
  const [isSendPending, startSendTransition] = useTransition()

  const [invoiceSent, setInvoiceSent] = useState(false)

  //Cancel booking
  async function cancel() {
    startCancelTransition(async () => {
      //If cancel is successful, show cancel success message and redirect to cancelled booking details
      if (await cancelBookingAction(bookingId)) {
        toast.success(t("CancelSuccess"))
        redirect(`/dashboard/bookings/${bookingId}`, RedirectType.replace)
      } else {
        //If cancel is not successful, show error message
        toast.error(t("CancelError"))
      }
    })
  }

  // Send invoice to customer over whatsapp
  async function sendInvoice() {
    startSendTransition(async () => {
      if (await sendInvoiceAction(bookingId)) {
        toast.success(t("SendSuccess"))
        setInvoiceSent(true)
      } else {
        toast.error(t("SendError"))
      }
    })
  }

  return (
    <div id="BookingDetailsPage" className={pageClassName}>
      {children}
      <div
        id="BookingDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <BookingDetailsSection sectionTitle={t("BookingInfo")}>
          <BookingDetailsItem
            title={t("BookingId")}
            value={bookingDetails.id}
          />
          <BookingDetailsItem
            title={t("Created")}
            value={format(bookingDetails.createdAt, "dd MMM hh:mm aaa")}
          />
          <BookingDetailsItem
            title={t("Status")}
            value={bookingDetails.status.toUpperCase()}
          />
          <BookingDetailsItem
            title={t("BookedBy")}
            value={bookingDetails.bookedByUser.name}
          />
          <BookingDetailsItem
            title={t("AssignedTo")}
            value={bookingDetails.assignedUser.name}
          />
          {isOwner && (
            <Button
              variant={"secondary"}
              className="sm:col-span-2 xl:col-span-3"
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-user`}
                className="w-full"
              >
                {t("AssignAgent")}
              </Link>
            </Button>
          )}
        </BookingDetailsSection>
        <Separator />
        <BookingDetailsSection sectionTitle={t("CustomerInfo")}>
          <BookingDetailsItem
            title={t("CustomerName")}
            value={bookingDetails.customer.name}
          />
          <BookingDetailsItem
            title={t("CustomerLocation")}
            value={
              bookingDetails.customer.location.city +
              ", " +
              bookingDetails.customer.location.state
            }
          />
          <BookingDetailsItem
            title={t("CustomerPhone")}
            value={bookingDetails.customer.phone}
          />
          {bookingDetails.customer.address && (
            <BookingDetailsItem
              title={t("CustomerAddress")}
              value={bookingDetails.customer.address}
            />
          )}
          {bookingDetails.customer.remarks && (
            <BookingDetailsItem
              title={t("CustomerRemarks")}
              value={bookingDetails.customer.remarks}
            />
          )}
          {(isOwner || isAssignedUser) && (
            <Button
              variant={"secondary"}
              className="sm:col-span-2 xl:col-span-3"
            >
              <Link
                href={`tel:${bookingDetails.customer.phone}`}
                className="w-full"
              >
                {t("CallCustomer")}
              </Link>
            </Button>
          )}
        </BookingDetailsSection>
        <Separator />
        <BookingDetailsSection sectionTitle={t("TripInfo")}>
          <BookingDetailsItem
            title={t("From")}
            value={
              bookingDetails.source.city + ", " + bookingDetails.source.state
            }
          />
          <BookingDetailsItem
            title={t("To")}
            value={
              bookingDetails.destination.city +
              ", " +
              bookingDetails.destination.state
            }
          />
          <BookingDetailsItem
            title={t("StartDate")}
            value={moment(bookingDetails.startDate).format("DD MMM")}
          />
          <BookingDetailsItem
            title={t("EndDate")}
            value={moment(bookingDetails.endDate).format("DD MMM")}
          />
          <BookingDetailsItem
            title={t("Distance")}
            value={bookingDetails.citydistance + t("Km")}
          />
          <BookingDetailsItem
            title={t("Type")}
            value={bookingDetails.type.toUpperCase()}
          />
          <BookingDetailsItem
            title={t("Passengers")}
            value={bookingDetails.passengers.toString()}
          />
          <BookingDetailsItem
            title={t("NeedsAC")}
            value={bookingDetails.needsAc ? t("Yes") : t("No")}
          />
          {bookingDetails.pickupAddress && (
            <BookingDetailsItem
              title={t("PickupAddress")}
              value={bookingDetails.pickupAddress!}
            />
          )}
          {bookingDetails.dropAddress && (
            <BookingDetailsItem
              title={t("DropAddress")}
              value={bookingDetails.dropAddress!}
            />
          )}
          {bookingDetails.startTime && (
            <BookingDetailsItem
              title={t("StartTime")}
              value={moment(bookingDetails.startTime!, "hh:mm:ss").format(
                "h:mm a"
              )}
            />
          )}
          {bookingDetails.remarks && (
            <BookingDetailsItem
              title={t("Remarks")}
              value={bookingDetails.remarks!}
            />
          )}
        </BookingDetailsSection>
        <Separator />
        <BookingDetailsSection sectionTitle={t("AssignmentInfo")}>
          <BookingDetailsItem
            title={t("AssignedVehicle")}
            value={bookingDetails.assignedVehicle?.vehicleNumber ?? "-"}
          />
          {bookingDetails.status == BookingStatusEnum.CONFIRMED && (
            <Button
              variant={
                bookingDetails.assignedVehicle?.vehicleNumber
                  ? "secondary"
                  : "default"
              }
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-vehicle`}
                className="w-full"
              >
                {bookingDetails.assignedVehicle
                  ? t("ChangeVehicle")
                  : t("AssignVehicle")}
              </Link>
            </Button>
          )}
          <BookingDetailsItem
            title={t("AssignedDriver")}
            value={bookingDetails.assignedDriver?.name ?? "-"}
          />
          {bookingDetails.status == BookingStatusEnum.CONFIRMED && (
            <Button
              variant={
                bookingDetails.assignedDriver?.name ? "secondary" : "default"
              }
            >
              <Link
                href={`/dashboard/bookings/${bookingId}/assign-driver`}
                className="w-full"
              >
                {bookingDetails.assignedDriver
                  ? t("ChangeDriver")
                  : t("AssignDriver")}
              </Link>
            </Button>
          )}
        </BookingDetailsSection>
        <Separator />
        <BookingDetailsSection sectionTitle={t("PriceInfo")}>
          <BookingDetailsPriceItem
            title={t("VehicleCharge")}
            value={"₹" + bookingDetails.totalVehicleRate}
            subtitle={t("RatePerKm", {
              rate: bookingDetails.ratePerKm,
              km: bookingDetails.totalDistance,
            })}
          />
          {bookingDetails.totalAcCharge > 0 && (
            <BookingDetailsPriceItem
              title={t("ACCharge")}
              value={"₹" + bookingDetails.totalAcCharge}
              subtitle={t("ACPerDay", {
                charge: bookingDetails.acChargePerDay,
              })}
            />
          )}
          <BookingDetailsPriceItem
            title={t("DriverAllowance")}
            value={"₹" + bookingDetails.totalDriverAllowance}
            subtitle={t("AllowancePerDay", {
              allowance: bookingDetails.allowancePerDay,
            })}
          />
          <BookingDetailsPriceItem
            title={t("Commission")}
            value={"₹" + bookingDetails.totalCommission}
            subtitle={t("CommissionRate", {
              rate: bookingDetails.commissionRate,
            })}
          />
          <BookingDetailsPriceItem
            title={t("TotalAmount")}
            value={"₹" + bookingDetails.totalAmount}
          />
        </BookingDetailsSection>
        {(isOwner || isAssignedUser) && (
          <div className="flex flex-col gap-3 lg:gap-4">
            {bookingDetails.status == BookingStatusEnum.COMPLETED &&
              isOwner && (
                <Link href={`/dashboard/bookings/${bookingId}/reconcile`}>
                  <Button variant={"default"}>{t("Reconcile")}</Button>
                </Link>
              )}
            {bookingDetails.status == BookingStatusEnum.COMPLETED && (
              <BookingDetailsAlertDialog
                title={t("Send.Title")}
                desc={t("Send.Desc")}
                noCTA={t("Send.NoCTA")}
                labelChild={
                  <Button variant={"outline"} disabled={invoiceSent}>
                    {invoiceSent ? t("InvoiceSent") : t("Send.Label")}
                  </Button>
                }
              >
                <Button
                  variant={"default"}
                  onClick={sendInvoice}
                  disabled={isSendPending}
                >
                  {isSendPending && <Spinner />}
                  {isSendPending ? t("Loading") : t("Send.YesCTA")}
                </Button>
              </BookingDetailsAlertDialog>
            )}
            {bookingDetails.status == BookingStatusEnum.CONFIRMED && (
              <BookingDetailsAlertDialog
                title={t("Cancel.Title")}
                desc={t("Cancel.Desc")}
                noCTA={t("Cancel.NoCTA")}
                labelChild={
                  <Button variant={"secondary"}>{t("Cancel.Label")}</Button>
                }
              >
                <Button
                  variant={"destructive"}
                  onClick={cancel}
                  disabled={isCancelPending}
                >
                  {isCancelPending && <Spinner />}
                  {isCancelPending ? t("Loading") : t("Cancel.YesCTA")}
                </Button>
              </BookingDetailsAlertDialog>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type BookingDetailsSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
const BookingDetailsSection = (props: BookingDetailsSectionType) => {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-center">
        {props.children}
      </div>
    </div>
  )
}

type BookingDetailsItemType = {
  title: string
  value: string
}
const BookingDetailsItem = (props: BookingDetailsItemType) => {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0.5 lg:gap-1 last:text-end sm:last:text-start">
      <CaptionGrey>{props.title}</CaptionGrey>
      <P>{props.value}</P>
    </div>
  )
}

type BookingDetailsPriceItemType = {
  title: string
  value: string
  subtitle?: string
}
const BookingDetailsPriceItem = (props: BookingDetailsPriceItemType) => {
  return (
    <div className="flex flex-row justify-between items-center gap-2 lg:gap-3">
      <CaptionGrey>{props.title}</CaptionGrey>
      <div className="flex flex-col gap-0.5 lg:gap-1 text-end">
        <P>{props.value}</P>
        {props.subtitle && <CaptionGrey>{props.subtitle}</CaptionGrey>}
      </div>
    </div>
  )
}

type BookingDetailsAlertDialogType = {
  title: string
  desc: string
  noCTA: string
  labelChild: JSX.Element
  children: React.ReactNode
}
const BookingDetailsAlertDialog = (props: BookingDetailsAlertDialogType) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.labelChild}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{props.noCTA}</AlertDialogCancel>
          <AlertDialogAction asChild>{props.children}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
