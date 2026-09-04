"use client"

import { RyogoCheckbox, RyogoTextarea } from "@/components/form/ryogoFormFields"
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
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { changePickupAddressAction } from "@/app/actions/bookings/changePickupAddressAction"

export default function ChangePickupAddressSheet({
  bookingId,
  agencyId,
  userId,
  originalPickupAddress,
  children,
  customerAddress,
}: {
  bookingId: string
  agencyId: string
  userId: string
  originalPickupAddress: string | null
  children: React.ReactNode
  customerAddress: string | null
}) {
  const t = useTranslations("Sheets.ChangePickupAddress")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    pickupAddress: z
      .string()
      .min(10, t("AddressError1"))
      .max(300, t("AddressError2")),
    sameAsCustomerAddress: z.boolean(),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      pickupAddress: originalPickupAddress ?? undefined,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedBooking = await changePickupAddressAction(
      bookingId,
      agencyId,
      userId,
      data.pickupAddress,
    )
    if (updatedBooking) {
      toast.success(t("Success"))
      router.refresh()
    } else {
      toast.error(t("Error"))
    }
  }

  const setValue = form.setValue
  const pickupAddressCopySelection = useWatch({
    name: "sameAsCustomerAddress",
    control: form.control,
  })

  useEffect(() => {
    if (!customerAddress) return
    if (pickupAddressCopySelection) {
      // If the checkbox is checked, set the target input's value
      setValue("pickupAddress", customerAddress)
    } else {
      // Clear the target input if unchecked
      setValue("pickupAddress", originalPickupAddress ?? "")
    }
  }, [pickupAddressCopySelection, customerAddress, setValue])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form id="changePickupAddress" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5 gap-2 lg:gap-3 flex flex-col">
              <RyogoTextarea
                name="pickupAddress"
                label={t("PickupAddress")}
                placeholder={t("PickupAddressPlaceholder")}
              />
              <RyogoCheckbox
                name={"sameAsCustomerAddress"}
                label={t("SameAsCustomerAddress")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changePickupAddress"
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
