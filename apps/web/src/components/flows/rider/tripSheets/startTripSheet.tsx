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
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { LatLongType } from "@ryogo-travel-app/api/types/location.types"
import { startTripAction } from "@/app/actions/bookings/startTripAction"
import TripSheetFormWrapper from "./tripSheetFormWrapper"
import { TripLogTypesEnum } from "@ryogo-travel-app/db/schema"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_FILE_UPLOAD_SIZE,
  MAX_ODOMETER_LIMIT,
  MIN_ODOMETER_LIMIT,
} from "@/lib/uiConfig"

export default function StartTripSheet({
  booking,
  latLong,
}: {
  booking: NonNullable<FindBookingDetailsByIdType>
  latLong?: LatLongType
}) {
  const t = useTranslations("Rider.MyBooking.StartTrip")
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const minOdo = booking.assignedVehicle?.odometerReading ?? MIN_ODOMETER_LIMIT

  const schema = z.object({
    odometerReading: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(minOdo, t("Field1.Error2", { maxOdo: minOdo }))
      .max(MAX_ODOMETER_LIMIT, t("Field1.Error3"))
      .multipleOf(1, t("Field1.Error4"))
      .nonnegative(t("Field1.Error5"))
      .nonoptional(t("Field1.Error1")),
    tripLogPhoto: FileRegex.refine((file) => {
      return file.length > 0
    }, t("Field2.Error3"))
      .refine((file) => {
        return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
      }, t("Field2.Error1"))
      .refine((file) => {
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field2.Error2"))
      .nonoptional(t("Field2.Error3")),
    remarks: z.string().optional(),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  if (!booking.assignedDriverId || !booking.assignedVehicleId) {
    setOpen(false)
    return null
  }
  const vehicleId = booking.assignedVehicleId
  const driverId = booking.assignedDriverId

  const onSubmit = async (data: SchemaType) => {
    const startTripData = {
      agencyId: booking.agencyId,
      bookingId: booking.id,
      driverId: driverId,
      vehicleId: vehicleId,
      type: TripLogTypesEnum.STARTED,
      odometerReading: data.odometerReading,
      remarks: data.remarks,
      tripLogPhoto: data.tripLogPhoto,
      lat: latLong?.latitude,
      long: latLong?.longitude,
    }
    const result = await startTripAction(startTripData)
    if (result) {
      setOpen(false)
      router.refresh()
    } else {
      toast.error(t("Error"))
      router.replace("/rider/myBookings")
    }
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <RyogoDefaultButton label={t("Title")} size="lg" />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <TripSheetFormWrapper<SchemaType>
          id="startTrip"
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
            description={t("Field2.Description")}
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
            form="startTrip"
            label={form.formState.isSubmitting ? t("Loading") : t("Start")}
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
