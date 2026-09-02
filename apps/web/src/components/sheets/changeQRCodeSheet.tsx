"use client"

import { RyogoFileInput } from "@/components/form/ryogoFormFields"
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
import { changeAgencyQRCodeAction } from "@/app/actions/agencies/changeAgencyQRCodeAction"
import { FileRegex } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function ChangeQRCodeSheet({
  agencyId,
  userId,
  newPhoto,
}: {
  agencyId: string
  userId: string
  newPhoto: boolean
}) {
  const t = useTranslations("Sheets.ChangeQRCode")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    qrCode: FileRegex.refine((file) => {
      return file[0] && file[0].size < 1000000
    }, t("Error1")).refine((file) => {
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
    }, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedAgency = await changeAgencyQRCodeAction(
      agencyId,
      userId,
      data.qrCode,
    )
    if (updatedAgency) {
      toast.success(t("Success"))
      router.refresh()
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <RyogoGhostButton
          label={newPhoto ? t("UploadButton") : t("ChangeButton")}
        />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Header")}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form id="changeQRCode" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoFileInput
                name={"qrCode"}
                register={form.register("qrCode")}
                label={t("Title")}
                placeholder={t("Placeholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeQRCode"
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
