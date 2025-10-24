"use client";

import { pageClassName } from "@/components/page/pageCommons";
import { PBold, PGrey, CaptionGrey, Caption } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FindBookingByIdType } from "@ryogo-travel-app/api/services/booking.services";
import { useTranslations } from "next-intl";
import z from "zod";
import { confirmBookingAction } from "./confirmBookingAction";
import { useEffect, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  DashboardCheckbox,
  DashboardTextarea,
  DashboardTimePicker,
} from "@/components/form/dashboardFormFields";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { cancelBookingAction } from "./cancelBookingAction";
import { toast } from "sonner";
import { redirect, RedirectType } from "next/navigation";
import moment from "moment";
import { sendQuoteAction } from "./sendQuoteAction";
import { format } from "date-fns";

export default function ConfirmBookingPageComponent({
  booking,
  isOwner,
}: {
  booking: NonNullable<FindBookingByIdType>;
  isOwner?: boolean;
}) {
  const t = useTranslations("Dashboard.ConfirmBooking");
  const [isConfirmPending, startConfirmTransition] = useTransition();
  const [isCancelPending, startCancelTransition] = useTransition();
  const [isSendPending, startSendTransition] = useTransition();

  const [quoteSent, setQuoteSent] = useState(false);

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
  });
  type ConfirmBookingType = z.infer<typeof confirmBookingSchema>;

  const form = useForm<ConfirmBookingType>({
    resolver: zodResolver(confirmBookingSchema),
    defaultValues: {
      pickupAddress: "",
      sameAsCustomerAddress: false,
      dropAddress: "",
    },
  });

  //Confirm booking
  async function confirm(values: ConfirmBookingType) {
    startConfirmTransition(async () => {
      if (
        await confirmBookingAction(
          booking.id,
          values.startTime,
          values.pickupAddress,
          values.dropAddress,
          booking.customer.address ? false : true,
          booking.customer.id
        )
      ) {
        toast.success(t("ConfirmSuccess"));
        redirect(`/dashboard/bookings/${booking.id}`, RedirectType.replace);
      } else {
        toast.error(t("ConfirmError"));
      }
    });
  }

  //Cancel booking
  async function cancel() {
    startCancelTransition(async () => {
      if (await cancelBookingAction(booking.id)) {
        toast.success(t("CancelSuccess"));
        redirect(`/dashboard/bookings`, RedirectType.replace);
      }
      toast.error(t("CancelError"));
    });
  }

  // TODO: Send quote to customer over whatsapp
  async function sendQuote() {
    startSendTransition(async () => {
      if (await sendQuoteAction(booking.id)) {
        toast.success(t("SendSuccess"));
        setQuoteSent(true);
      } else {
        toast.error(t("SendError"));
      }
    });
  }

  const setValue = form.setValue;
  // Watch the checkbox and the source input field
  const pickupAddressCopySelection = form.watch("sameAsCustomerAddress");
  const pickupAddressSourceValue = booking.customer.address;

  useEffect(() => {
    if (!pickupAddressSourceValue) return;
    if (pickupAddressCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("pickupAddress", pickupAddressSourceValue);
    } else {
      // Optionally, clear the target input if unchecked
      setValue("pickupAddress", "");
    }
  }, [pickupAddressCopySelection, pickupAddressSourceValue, setValue]);

  return (
    <div id="ConfirmBookingPage" className={pageClassName}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(confirm)}>
          <div
            id="ConfirmBookingInfo"
            className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
          >
            <ConfirmBookingSection sectionTitle={t("BookingInfo")}>
              <ConfirmBookingItem title={t("BookingId")} value={booking.id} />
              <ConfirmBookingItem
                title={t("Created")}
                value={format(booking.createdAt, "dd MMM hh:mm aaa")}
              />
              <ConfirmBookingItem
                title={t("BookedBy")}
                value={booking.bookedByUser.name}
              />
              <ConfirmBookingItem
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
            </ConfirmBookingSection>
            <Separator />
            <ConfirmBookingSection sectionTitle={t("CustomerInfo")}>
              <ConfirmBookingItem
                title={t("CustomerName")}
                value={booking.customer.name}
              />
              <ConfirmBookingItem
                title={t("CustomerLocation")}
                value={
                  booking.customer.location.city +
                  ", " +
                  booking.customer.location.state
                }
              />
              <ConfirmBookingItem
                title={t("CustomerPhone")}
                value={booking.customer.phone}
              />
              {booking.customer.address && (
                <ConfirmBookingItem
                  title={t("CustomerAddress")}
                  value={booking.customer.address}
                />
              )}
              {booking.customer.remarks && (
                <ConfirmBookingItem
                  title={t("CustomerRemarks")}
                  value={booking.customer.remarks}
                />
              )}
            </ConfirmBookingSection>
            <Separator />
            <ConfirmBookingSection sectionTitle={t("TripInfo")}>
              <ConfirmBookingItem
                title={t("From")}
                value={booking.source.city + ", " + booking.source.state}
              />
              <ConfirmBookingItem
                title={t("To")}
                value={
                  booking.destination.city + ", " + booking.destination.state
                }
              />
              <ConfirmBookingItem
                title={t("StartDate")}
                value={moment(booking.startDate).format("DD MMM")}
              />
              <ConfirmBookingItem
                title={t("EndDate")}
                value={moment(booking.endDate).format("DD MMM")}
              />
              <ConfirmBookingItem
                title={t("Distance")}
                value={booking.citydistance + t("Km")}
              />
              <ConfirmBookingItem
                title={t("Type")}
                value={booking.type.toUpperCase()}
              />
              <ConfirmBookingItem
                title={t("Passengers")}
                value={booking.passengers.toString()}
              />
              <ConfirmBookingItem
                title={t("NeedsAC")}
                value={booking.needsAc ? t("Yes") : t("No")}
              />
            </ConfirmBookingSection>
            <Separator />
            <ConfirmBookingSection sectionTitle={t("AssignmentInfo")}>
              <PBold>{booking.assignedVehicle?.vehicleNumber ?? "-"}</PBold>
              <Button
                variant={
                  booking.assignedVehicle?.vehicleNumber
                    ? "secondary"
                    : "outline"
                }
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
              <PBold>{booking.assignedDriver?.name ?? "-"}</PBold>
              <Button
                variant={booking.assignedDriver?.name ? "secondary" : "outline"}
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
            </ConfirmBookingSection>
            <Separator />
            <ConfirmBookingFinalSection sectionTitle={t("PriceInfo")}>
              <ConfirmBookingPriceItem
                title={t("VehicleCharge")}
                value={"₹" + booking.totalVehicleRate}
                subtitle={t("RatePerKm", {
                  rate: booking.ratePerKm,
                  km: booking.totalDistance,
                })}
              />
              <ConfirmBookingPriceItem
                title={t("ACCharge")}
                value={"₹" + booking.totalAcCharge}
                subtitle={t("ACPerDay", { charge: booking.acChargePerDay })}
              />
              <ConfirmBookingPriceItem
                title={t("DriverAllowance")}
                value={"₹" + booking.totalDriverAllowance}
                subtitle={t("AllowancePerDay", {
                  allowance: booking.allowancePerDay,
                })}
              />
              <ConfirmBookingPriceItem
                title={t("Commission")}
                value={"₹" + booking.totalCommission}
                subtitle={t("CommissionRate", { rate: booking.commissionRate })}
              />
              <ConfirmBookingPriceItem
                title={t("TotalAmount")}
                value={"₹" + booking.totalAmount}
              />
            </ConfirmBookingFinalSection>
            <Separator />
            <ConfirmBookingSection sectionTitle={t("ConfirmInfo")}>
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
            </ConfirmBookingSection>
            <div className="flex flex-col gap-3 lg:gap-4">
              <Button
                variant={"default"}
                type="submit"
                disabled={isConfirmPending}
              >
                {isConfirmPending && <Spinner />}
                {isConfirmPending ? t("Loading") : t("PrimaryCTA")}
              </Button>
              <Button
                variant={"outline"}
                onClick={sendQuote}
                disabled={isSendPending || quoteSent}
              >
                {isSendPending && <Spinner />}
                {isSendPending
                  ? t("Loading")
                  : quoteSent
                  ? t("QuoteSent")
                  : t("SendCTA")}
              </Button>
              <Button
                variant={"link"}
                onClick={cancel}
                disabled={isCancelPending}
              >
                {isCancelPending && <Spinner />}
                {isCancelPending ? t("Loading") : t("CancelCTA")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

type ConfirmBookingSectionType = {
  sectionTitle: string;
  children: React.ReactNode;
};
const ConfirmBookingSection = (props: ConfirmBookingSectionType) => {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <PGrey>{props.sectionTitle}</PGrey>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-center">
        {props.children}
      </div>
    </div>
  );
};

const ConfirmBookingFinalSection = (props: ConfirmBookingSectionType) => {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <PGrey>{props.sectionTitle}</PGrey>
      <div className="grid grid-cols-1 gap-3 lg:gap-4 items-center">
        {props.children}
      </div>
    </div>
  );
};

type ConfirmBookingItemType = {
  title: string;
  value: string;
};
const ConfirmBookingItem = (props: ConfirmBookingItemType) => {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0.5 lg:gap-1 last:text-end sm:last:text-start">
      <Caption>{props.title}</Caption>
      <PBold>{props.value}</PBold>
    </div>
  );
};

type ConfirmBookingPriceItemType = {
  title: string;
  value: string;
  subtitle?: string;
};
const ConfirmBookingPriceItem = (props: ConfirmBookingPriceItemType) => {
  return (
    <div className="flex flex-row justify-between items-center gap-2 lg:gap-3">
      <Caption>{props.title}</Caption>
      <div className="flex flex-col gap-0.5 lg:gap-1 text-end">
        <PBold>{props.value}</PBold>
        {props.subtitle && <CaptionGrey>{props.subtitle}</CaptionGrey>}
      </div>
    </div>
  );
};
