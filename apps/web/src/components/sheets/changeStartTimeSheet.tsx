"use client"

import { RyogoTimePicker } from "@/components/form/ryogoFormFields"
import { Form } from "@/components/ui/form"
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
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { changeStartTimeAction } from "@/app/actions/bookings/changeStartTimeAction"

export default function ChangeStartTimeSheet({
  bookingId,
  agencyId,
  userId,
  originalStartTime,
  children,
}: {
  bookingId: string
  agencyId: string
  userId: string
  originalStartTime: string | null
  children: React.ReactNode
}) {
  const t = useTranslations("Sheets.ChangeStartTime")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    startTime: z.iso.time(t("PickupTimeError")).nonempty(t("PickupTimeError")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      startTime: originalStartTime ?? undefined,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedBooking = await changeStartTimeAction(
      bookingId,
      agencyId,
      userId,
      data.startTime,
    )
    if (updatedBooking) {
      toast.success(t("Success"))
      router.refresh()
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form id="changeStartTime" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoTimePicker name="startTime" label={t("PickupTime")} />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeStartTime"
            label={t("Save")}
          />
          <RyogoOutlineButton
            disabled={form.formState.isSubmitting}
            type="button"
            onClick={() => setOpen(false)}
            label={t("Close")}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
