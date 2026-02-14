"use client"

import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FindLeadBookingByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { useTranslations } from "next-intl"
import z from "zod"
import { confirmBookingAction } from "@/app/actions/bookings/confirmBookingAction"
import { useEffect, useTransition } from "react"
import { Spinner } from "@/components/ui/spinner"
import {
  DashboardCheckbox,
  DashboardTextarea,
  DashboardTimePicker,
} from "@/components/form/dashboardFormFields"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import moment from "moment"
import { format } from "date-fns"
import CancelBookingAlertButton from "@/app/dashboard/components/buttons/cancelBookingAlertButton"
import SendQuoteAlertButton from "@/app/dashboard/components/buttons/sendQuoteAlertButton"
import BookingAlertDialog from "@/app/dashboard/components/buttons/bookingAlertDialog"
import BookingItem from "@/app/dashboard/components/bookings/bookingItem"
import BookingSection from "@/app/dashboard/components/bookings/bookingSection"
import BookingPriceItem from "@/app/dashboard/components/bookings/bookingPriceItem"
import BookingPriceSection from "@/app/dashboard/components/bookings/bookingPriceSection"

export default function ConfirmBookingPageComponent({
  booking,
  isOwner,
  isAssignedUser,
}: {
  booking: NonNullable<FindLeadBookingByIdType>
  isOwner: boolean
  isAssignedUser: boolean
}) {
  const t = useTranslations("Dashboard.ConfirmBooking")
  const router = useRouter()

  const [isConfirmPending, startConfirmTransition] = useTransition()

  const confirmBookingSchema = z.object({
    pickupAddress: z
      .string()
      .min(10, t("AddressError1"))
      .max(300, t("AddressError2")),
    sameAsCustomerAddress: z.boolean(),
    dropAddress: z
      .string()
      .min(10, t("AddressError1"))
      .max(300, t("AddressError2")),
    startTime: z.iso.time(t("PickupTimeError")).nonempty(t("PickupTimeError")),
  })
  type ConfirmBookingType = z.infer<typeof confirmBookingSchema>

  const form = useForm<ConfirmBookingType>({
    resolver: zodResolver(confirmBookingSchema),
    defaultValues: {
      pickupAddress: "",
      sameAsCustomerAddress: false,
      dropAddress: "",
    },
  })

  //Confirm booking
  async function confirm(values: ConfirmBookingType) {
    startConfirmTransition(async () => {
      const confirmedBooking = await confirmBookingAction(
        booking.id,
        booking.agencyId,
        booking.assignedUserId,
        values.startTime,
        values.pickupAddress,
        values.dropAddress,
        booking.customer.address ? false : true,
        booking.customer.id,
      )
      if (confirmedBooking) {
        toast.success(t("ConfirmSuccess"))
        router.replace(`/dashboard/bookings/${booking.id}`)
      } else {
        toast.error(t("ConfirmError"))
      }
    })
  }

  const setValue = form.setValue
  // Watch the checkbox and the source input field
  const pickupAddressCopySelection = form.watch("sameAsCustomerAddress")
  const pickupAddressSourceValue = booking.customer.address

  useEffect(() => {
    if (!pickupAddressSourceValue) return
    if (pickupAddressCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("pickupAddress", pickupAddressSourceValue)
    } else {
      // Optionally, clear the target input if unchecked
      setValue("pickupAddress", "")
    }
  }, [pickupAddressCopySelection, pickupAddressSourceValue, setValue])

  return (
    <div id="ConfirmBookingPage" className={pageClassName}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(confirm)}>
          <div
            id="ConfirmBookingInfo"
            className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
          >
            <BookingSection sectionTitle={t("BookingInfo")}>
              <BookingItem title={t("BookingId")} value={booking.id} />
              <BookingItem
                title={t("Created")}
                value={format(booking.createdAt, "dd MMM hh:mm aaa")}
              />
              <BookingItem
                title={t("BookedBy")}
                value={booking.bookedByUser.name}
              />
              <BookingItem
                title={t("AssignedTo")}
                value={booking.assignedUser.name}
              />
              {isOwner && (
                <Button
                  variant={"secondary"}
                  className="sm:col-span-2 xl:col-span-3"
                >
                  <Link
                    href={`/dashboard/bookings/${booking.id}/assign-user`}
                    className="w-full"
                  >
                    {t("AssignAgent")}
                  </Link>
                </Button>
              )}
            </BookingSection>
            <Separator />
            <BookingSection sectionTitle={t("CustomerInfo")}>
              <BookingItem
                title={t("CustomerName")}
                value={booking.customer.name}
              />
              <BookingItem
                title={t("CustomerLocation")}
                value={
                  booking.customer.location.city +
                  ", " +
                  booking.customer.location.state
                }
              />
              <BookingItem
                title={t("CustomerPhone")}
                value={booking.customer.phone}
              />
              {booking.customer.address && (
                <BookingItem
                  title={t("CustomerAddress")}
                  value={booking.customer.address}
                />
              )}
              {booking.customer.remarks && (
                <BookingItem
                  title={t("CustomerRemarks")}
                  value={booking.customer.remarks}
                />
              )}
            </BookingSection>
            <Separator />
            <BookingSection sectionTitle={t("TripInfo")}>
              <BookingItem
                title={t("From")}
                value={booking.source.city + ", " + booking.source.state}
              />
              <BookingItem
                title={t("To")}
                value={
                  booking.destination.city + ", " + booking.destination.state
                }
              />
              <BookingItem
                title={t("StartDate")}
                value={moment(booking.startDate).format("DD MMM")}
              />
              <BookingItem
                title={t("EndDate")}
                value={moment(booking.endDate).format("DD MMM")}
              />
              <BookingItem
                title={t("Distance")}
                value={booking.citydistance + t("Km")}
              />
              <BookingItem
                title={t("Type")}
                value={booking.type.toUpperCase()}
              />
              <BookingItem
                title={t("Passengers")}
                value={booking.passengers.toString()}
              />
              <BookingItem
                title={t("NeedsAC")}
                value={booking.needsAc ? t("Yes") : t("No")}
              />
            </BookingSection>
            <Separator />
            <BookingSection sectionTitle={t("AssignmentInfo")}>
              <BookingItem
                title={t("AssignedVehicle")}
                value={
                  booking.assignedVehicle
                    ? booking.assignedVehicle.vehicleNumber
                    : "-"
                }
              />
              <Button
                variant={booking.assignedVehicle ? "secondary" : "outline"}
                className="xl:col-span-3"
              >
                <Link
                  href={`/dashboard/bookings/${booking.id}/assign-vehicle`}
                  className="w-full"
                >
                  {booking.assignedVehicle
                    ? t("ChangeVehicle")
                    : t("AssignVehicle")}
                </Link>
              </Button>
              <BookingItem
                title={t("AssignedDriver")}
                value={
                  booking.assignedDriver ? booking.assignedDriver.name : "-"
                }
              />
              <Button
                variant={booking.assignedDriver ? "secondary" : "outline"}
                className="xl:col-span-3"
              >
                <Link
                  href={`/dashboard/bookings/${booking.id}/assign-driver`}
                  className="w-full"
                >
                  {booking.assignedDriver
                    ? t("ChangeDriver")
                    : t("AssignDriver")}
                </Link>
              </Button>
            </BookingSection>
            <Separator />
            <BookingPriceSection sectionTitle={t("PriceInfo")}>
              <BookingPriceItem
                title={t("VehicleCharge")}
                value={"₹" + booking.totalVehicleRate}
                subtitle={t("RatePerKm", {
                  rate: booking.ratePerKm,
                  km: booking.totalDistance,
                })}
              />
              <BookingPriceItem
                title={t("ACCharge")}
                value={"₹" + booking.totalAcCharge}
                subtitle={t("ACPerDay", { charge: booking.acChargePerDay })}
              />
              <BookingPriceItem
                title={t("DriverAllowance")}
                value={"₹" + booking.totalDriverAllowance}
                subtitle={t("AllowancePerDay", {
                  allowance: booking.allowancePerDay,
                })}
              />
              <BookingPriceItem
                title={t("Commission")}
                value={"₹" + booking.totalCommission}
                subtitle={t("CommissionRate", { rate: booking.commissionRate })}
              />
              <BookingPriceItem
                title={t("TotalAmount")}
                value={"₹" + booking.totalAmount}
              />
            </BookingPriceSection>
            <Separator />
            <BookingSection sectionTitle={t("ConfirmInfo")}>
              <DashboardTextarea
                name="pickupAddress"
                label={t("PickupAddress")}
                placeholder={t("PickupAddressPlaceholder")}
              />
              <DashboardCheckbox
                register={form.register("sameAsCustomerAddress")}
                name={"sameAsCustomerAddress"}
                label={t("SameAsCustomerAddress")}
              />
              <DashboardTextarea
                name="dropAddress"
                label={t("DropAddress")}
                placeholder={t("DropAddressPlaceholder")}
              />
              <DashboardTimePicker name="startTime" label={t("PickupTime")} />
            </BookingSection>
            {(isOwner || isAssignedUser) && (
              <div className="flex flex-col gap-3 lg:gap-4">
                <BookingAlertDialog
                  title={t("Confirm.Title")}
                  desc={t("Confirm.Desc")}
                  noCTA={t("Confirm.NoCTA")}
                  labelChild={
                    <Button variant={"default"}>{t("Confirm.Label")}</Button>
                  }
                >
                  <Button
                    onClick={() => form.handleSubmit(confirm)()}
                    variant={"default"}
                    disabled={isConfirmPending}
                  >
                    {isConfirmPending && <Spinner />}
                    {isConfirmPending ? t("Loading") : t("Confirm.YesCTA")}
                  </Button>
                </BookingAlertDialog>
                <SendQuoteAlertButton
                  bookingId={booking.id}
                  agencyId={booking.agencyId}
                  assignedUserId={booking.assignedUserId}
                />
                <CancelBookingAlertButton
                  bookingId={booking.id}
                  agencyId={booking.agencyId}
                  assignedUserId={booking.assignedUserId}
                />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
