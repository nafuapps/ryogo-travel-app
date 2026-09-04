"use client"

import { RyogoTextarea } from "@/components/form/ryogoFormFields"
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
import { changeBookingRemarksAction } from "@/app/actions/bookings/changeBookingRemarksAction"

export default function ChangeBookingRemarksSheet({
  bookingId,
  agencyId,
  userId,
  originalRemarks,
  children,
}: {
  bookingId: string
  agencyId: string
  userId: string
  originalRemarks: string | null
  children: React.ReactNode
}) {
  const t = useTranslations("Sheets.ChangeBookingRemarks")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    remarks: z.string().max(300, t("RemarksError")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      remarks: originalRemarks ?? undefined,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedBooking = await changeBookingRemarksAction(
      bookingId,
      agencyId,
      userId,
      data.remarks,
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
          <form id="changeRemarks" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoTextarea
                name="remarks"
                label={t("Remarks")}
                placeholder={t("RemarksPlaceHolder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeRemarks"
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
