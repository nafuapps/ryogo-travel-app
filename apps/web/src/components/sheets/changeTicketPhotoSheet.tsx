"use client"

import { RyogoFileInput } from "@/components/form/ryogoFormFields"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"
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
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { changeSupportTicketPhotoAction } from "@/app/actions/support/changeSupportTicketPhotoAction"

export default function ChangeTicketPhotoSheet({
  ticketId,
  userId,
  newPhoto,
}: {
  ticketId: string
  userId: string
  newPhoto: boolean
}) {
  const t = useTranslations("Sheets.ChangeTicketPhoto")
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    photo: z
      .instanceof(FileList)
      .refine((file) => {
        return file[0] && file[0].size < 1000000
      }, t("Error1"))
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
      }, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    startTransition(async () => {
      if (await changeSupportTicketPhotoAction(ticketId, userId, data.photo)) {
        toast.success(t("Success"))
        router.refresh()
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="hover:underline">
        <Button variant="outline">
          <RyogoCaption color="slate">
            {newPhoto ? t("UploadButton") : t("ChangeButton")}
          </RyogoCaption>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Header")}</SheetTitle>
        </SheetHeader>
        <Form {...formData}>
          <form id="changePhoto" onSubmit={formData.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoFileInput
                name={"photo"}
                register={formData.register("photo")}
                label={t("Title")}
                placeholder={t("Placeholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button type="submit" disabled={isPending} form="changePhoto">
            {t("Save")}
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
