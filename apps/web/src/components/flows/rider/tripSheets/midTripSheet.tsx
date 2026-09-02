"use client"

import {
  RyogoFileInput,
  RyogoInput,
  RyogoTextarea,
} from "@/components/form/ryogoFormFields"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { midTripAction } from "@/app/actions/bookings/midTripAction"
import { useLocation } from "@/hooks/useLocation"
import TripSheetFormWrapper from "./tripSheetFormWrapper"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { otherTripLogAction } from "@/app/actions/bookings/otherTripLogAction"

export default function MidTripSheet({
  booking,
  tripType,
  captureOtherTripLog,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  tripType: TripLogTypesEnum
  captureOtherTripLog?: boolean
}) {
  const t = useTranslations("Rider.MyBooking.MidTrip")
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const latLong = useLocation()

  const type: string =
    tripType === TripLogTypesEnum.ARRIVED
      ? "Arrived"
      : tripType === TripLogTypesEnum.PICKED_UP
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
    tripLogPhoto: FileRegex.refine((file) => {
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
          ].includes(file[0].type)
        )
      }, t("Field2.Error2"))
      .optional(),
    remarks: z.string().optional(),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  if (!booking.assignedDriverId || !booking.assignedVehicleId) {
    setOpen(false)
    return <></>
  }
  const vehicleId = booking.assignedVehicleId
  const driverId = booking.assignedDriverId

  useEffect(() => {
    const triggerAction = async () => {
      if (captureOtherTripLog && latLong.latitude && latLong.longitude) {
        await otherTripLogAction({
          agencyId: booking.agencyId,
          bookingId: booking.id,
          driverId: driverId,
          vehicleId: vehicleId,
          type: TripLogTypesEnum.OTHER,
          lat: latLong.latitude,
          long: latLong.longitude,
        })
      }
    }
    triggerAction()
  }, [latLong])

  const onSubmit = async (data: SchemaType) => {
    const midTripData = {
      agencyId: booking.agencyId,
      bookingId: booking.id,
      driverId: driverId,
      vehicleId: vehicleId,
      odometerReading: data.odometerReading,
      type: tripType,
      remarks: data.remarks,
      tripLogPhoto: data.tripLogPhoto,
      lat: latLong.latitude,
      long: latLong.longitude,
    }
    const result = await midTripAction(midTripData)
    if (result) {
      router.refresh()
      setOpen(false)
    } else {
      toast.error(t("Error", { type: type }))
      router.replace("/rider/myBookings")
    }
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <RyogoDefaultButton label={t("Title", { type: type })} size="lg" />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title", { type: type })}</SheetTitle>
        </SheetHeader>
        <TripSheetFormWrapper<SchemaType>
          id="midTrip"
          onSubmit={form.handleSubmit(onSubmit)}
          form={form}
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
            register={form.register("tripLogPhoto")}
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description", { type: type })}
          />
          <RyogoTextarea
            name="remarks"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
          />
        </TripSheetFormWrapper>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            form="midTrip"
            label={
              form.formState.isSubmitting
                ? t("Loading")
                : t("Mid", { type: type })
            }
          />
          <RyogoOutlineButton
            label={t("Close")}
            type="button"
            disabled={form.formState.isSubmitting}
            onClick={() => setOpen(false)}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
