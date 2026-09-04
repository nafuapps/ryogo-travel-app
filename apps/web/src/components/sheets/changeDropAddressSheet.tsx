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
import { changeDropAddressAction } from "@/app/actions/bookings/changeDropAddressAction"

export default function ChangeDropAddressSheet({
  bookingId,
  agencyId,
  userId,
  originalDropAddress,
  children,
}: {
  bookingId: string
  agencyId: string
  userId: string
  originalDropAddress: string | null
  children: React.ReactNode
}) {
  const t = useTranslations("Sheets.ChangeDropAddress")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    dropAddress: z
      .string()
      .min(10, t("AddressError1"))
      .max(300, t("AddressError2")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      dropAddress: originalDropAddress ?? undefined,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedBooking = await changeDropAddressAction(
      bookingId,
      agencyId,
      userId,
      data.dropAddress,
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
          <form id="changeDropAddress" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoTextarea
                name="dropAddress"
                label={t("DropAddress")}
                placeholder={t("DropAddressPlaceholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeDropAddress"
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
