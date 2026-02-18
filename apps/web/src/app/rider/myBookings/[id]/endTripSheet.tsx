"use client"

import {
  DashboardFileInput,
  DashboardInput,
  DashboardRating,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { endTripAction } from "@/app/actions/bookings/endTripAction"
import Link from "next/link"
import { UrlObject } from "url"

const TOTAL_STARS = 5

export default function EndTripSheet({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = useTranslations("Rider.MyBooking.EndTrip")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const maxOdo = booking.assignedVehicle?.odometerReading ?? 1
  const [open, setOpen] = useState(false)

  const [customerRating, setCustomerRating] = useState(0)
  const [bookingRating, setBookingRating] = useState(0)

  const schema = z.object({
    odometerReading: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(maxOdo, t("Field1.Error2", { maxOdo: maxOdo }))
      .max(1000000, t("Field1.Error3"))
      .multipleOf(1, t("Field1.Error4"))
      .nonnegative(t("Field1.Error5"))
      .nonoptional(t("Field1.Error1")),
    tripLogPhoto: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0].size < 1000000
      }, t("Field2.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field2.Error2"))
      .optional(),
    remarks: z.string().optional(),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  if (!booking.assignedDriverId || !booking.assignedVehicleId) {
    router.replace("/rider/myBookings")
    return
  }
  const vehicleId = booking.assignedVehicleId
  const driverId = booking.assignedDriverId

  const onSubmit = async (data: SchemaType) => {
    //TODO: Get lat long of the device
    startTransition(async () => {
      if (
        await endTripAction({
          agencyId: booking.agencyId,
          bookingId: booking.id,
          driverId: driverId,
          vehicleId: vehicleId,
          customerId: booking.customerId,
          odometerReading: data.odometerReading,
          remarks: data.remarks,
          tripLogPhoto: data.tripLogPhoto,
          customerRating:
            customerRating > 0 && customerRating <= TOTAL_STARS
              ? customerRating
              : undefined,
          bookingRating:
            bookingRating > 0 && bookingRating <= TOTAL_STARS
              ? bookingRating
              : undefined,
        })
      ) {
        router.refresh()
        setOpen(false)
      } else {
        toast.error(t("Error"))
        router.replace("/rider/myBookings")
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button variant="default" className="w-full">
          {t("Title")}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
          <SheetDescription>{t("Warning")}</SheetDescription>
        </SheetHeader>
        <Form {...formData}>
          <form
            id="endTrip"
            onSubmit={formData.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 lg:gap-4 px-4 lg:px-5"
          >
            <DashboardInput
              name={"odometerReading"}
              type="tel"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <DashboardFileInput
              name={"tripLogPhoto"}
              register={formData.register("tripLogPhoto")}
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
              description={t("Field2.Description")}
            />
            <DashboardTextarea
              name="remarks"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
            />
            <DashboardRating
              name="customerRating"
              label={t("Field4.Title")}
              selectedStars={customerRating}
              setSelectedStars={setCustomerRating}
              totalStars={TOTAL_STARS}
            />
            <DashboardRating
              name="bookingRating"
              label={t("Field5.Title")}
              selectedStars={bookingRating}
              setSelectedStars={setBookingRating}
              totalStars={TOTAL_STARS}
            />
          </form>
        </Form>
        <SheetFooter>
          <Button type="submit" disabled={isPending} form="endTrip">
            {isPending ? t("Loading") : t("End")}
          </Button>
          <Link
            href={
              `/rider/myBookings/${booking.id}/add-expense` as unknown as UrlObject
            }
          >
            <Button
              type="button"
              variant={"secondary"}
              disabled={isPending}
              form="endTrip"
              className="w-full"
            >
              {t("AddExpense")}
            </Button>
          </Link>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              {t("Close")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
