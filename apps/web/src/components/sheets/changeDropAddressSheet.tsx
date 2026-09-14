"use client"

import { RyogoTextarea } from "@/components/form/ryogoFormFields"
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
import { MIN_FIELD_DESC_LENGTH, MAX_FIELD_DESC_LENGTH } from "@/lib/uiConfig"
import { FormWrapper, FormContentWrapper } from "@/components/page/pageWrappers"

export default function ChangeDropAddressSheet({
  bookingId,
  agencyId,
  userId,
  originalDropAddress,
  children,
  canEdit = true,
}: {
  bookingId: string
  agencyId: string
  userId: string
  originalDropAddress: string | null
  children: React.ReactNode
  canEdit?: boolean
}) {
  if (!canEdit) return children

  const t = useTranslations("Sheets.ChangeDropAddress")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    dropAddress: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("AddressError1"))
      .max(MAX_FIELD_DESC_LENGTH, t("AddressError2")),
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
        <FormWrapper
          form={form}
          id="changeDropAddress"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoTextarea
              name="dropAddress"
              label={t("DropAddress")}
              placeholder={t("DropAddressPlaceholder")}
            />
          </FormContentWrapper>
        </FormWrapper>
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
