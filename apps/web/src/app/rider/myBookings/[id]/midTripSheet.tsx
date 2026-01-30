"use client"

import {
  DashboardFileInput,
  DashboardInput,
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
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { midTripAction } from "@/app/actions/midTripAction"
import { useLocation } from "@/hooks/useLocation"

export default function MidTripSheet({
  booking,
  tripType,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  tripType: TripLogTypesEnum
}) {
  const t = useTranslations("Rider.MyBooking.MidTrip")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const latLong = useLocation()
  console.log(latLong)

  const type: string =
    tripType == TripLogTypesEnum.ARRIVED
      ? "Arrived"
      : tripType == TripLogTypesEnum.PICKUP
        ? "Pickup"
        : "Drop"

  const maxOdo = booking.assignedVehicle?.odometerReading ?? 1

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
        return file[0]!.size < 1000000
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
          ].includes(file[0]!.type)
        )
      }, t("Field2.Error2"))
      .optional(),
    remarks: z.string().optional(),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    //TODO: Get lat long of the device
    startTransition(async () => {
      if (
        await midTripAction({
          agencyId: booking.agencyId,
          bookingId: booking.id,
          driverId: booking.assignedDriverId!,
          vehicleId: booking.assignedVehicleId!,
          odometerReading: data.odometerReading,
          type: tripType,
          remarks: data.remarks,
          tripLogPhoto: data.tripLogPhoto,
        })
      ) {
        router.refresh()
        setOpen(false)
      } else {
        toast.error(t("Error", { type: type }))
        router.replace("/rider/myBookings")
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button variant="default" className="w-full">
          {t("Title", { type: type })}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title", { type: type })}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Form {...formData}>
          <form id="midTrip" onSubmit={formData.handleSubmit(onSubmit)}>
            <div className="px-4 lg:px-5 gap-2 lg:gap-3">
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
                description={t("Field2.Description", { type: type })}
              />
              <DashboardTextarea
                name="remarks"
                label={t("Field3.Title")}
                placeholder={t("Field3.Placeholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button type="submit" disabled={isPending} form="midTrip">
            {isPending ? t("Loading") : t("Mid", { type: type })}
          </Button>
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
