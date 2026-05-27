"use client"

import {
  RyogoFileInput,
  RyogoInput,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import {
  Sheet,
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
import { startTripAction } from "@/app/actions/bookings/startTripAction"
import TripSheetFormWrapper from "./tripSheetFormWrapper"
import { useLocation } from "@/hooks/useLocation"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"

export default function StartTripSheet({
  booking,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = useTranslations("Rider.MyBooking.StartTrip")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const latLong = useLocation()

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
        return file.length > 0
      }, t("Field2.Error3"))
      .refine((file) => {
        return file[0] && file[0].size < 1000000
      }, t("Field2.Error1"))
      .refine((file) => {
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
          ].includes(file[0].type)
        )
      }, t("Field2.Error2"))
      .nonoptional(t("Field2.Error3")),
    remarks: z.string().optional(),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  if (!booking.assignedDriverId || !booking.assignedVehicleId) {
    setOpen(false)
    return <></>
  }
  const vehicleId = booking.assignedVehicleId
  const driverId = booking.assignedDriverId

  const onSubmit = async (data: SchemaType) => {
    const startTripData = {
      agencyId: booking.agencyId,
      bookingId: booking.id,
      driverId: driverId,
      vehicleId: vehicleId,
      type: TripLogTypesEnum.START_TRIP,
      odometerReading: data.odometerReading,
      remarks: data.remarks,
      tripLogPhoto: data.tripLogPhoto,
      lat: latLong.latitude,
      long: latLong.longitude,
    }
    startTransition(async () => {
      if (await startTripAction(startTripData)) {
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
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <TripSheetFormWrapper<SchemaType>
          id="startTrip"
          onSubmit={formData.handleSubmit(onSubmit)}
          form={formData}
        >
          <RyogoInput
            name={"odometerReading"}
            type="tel"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <RyogoFileInput
            name={"tripLogPhoto"}
            register={formData.register("tripLogPhoto")}
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <RyogoTextarea
            name="remarks"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
        </TripSheetFormWrapper>
        <SheetFooter>
          <Button type="submit" disabled={isPending} form="startTrip">
            {isPending ? t("Loading") : t("Start")}
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            {t("Close")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
