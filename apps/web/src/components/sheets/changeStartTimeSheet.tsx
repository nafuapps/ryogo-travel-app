"use client"

import { changeStartTimeAction } from "@/app/actions/bookings/changeStartTimeAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoTimePicker } from "@/components/form/ryogoFormFields"
import { FormContentWrapper, FormWrapper } from "@/components/page/pageWrappers"
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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ChangeStartTimeSheet({
  bookingId,
  agencyId,
  userId,
  originalStartTime,
  children,
  canEdit = true,
}: {
  bookingId: string
  agencyId: string
  userId: string
  originalStartTime: string | null
  children: React.ReactNode
  canEdit?: boolean
}) {
  if (!canEdit) return children

  const t = useTranslations("Components.Sheets.ChangeStartTime")
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

  const onSubmit = async (values: SchemaType) => {
    setOpen(false)
    const updatedBooking = await changeStartTimeAction({
      bookingId,
      agencyId,
      assignedUserId: userId,
      startTime: values.startTime,
    })
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
        <FormWrapper
          form={form}
          id="changeStartTime"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoTimePicker name="startTime" label={t("PickupTime")} />
          </FormContentWrapper>
        </FormWrapper>
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
