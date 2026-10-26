"use client"

import { changeSupportTicketPhotoAction } from "@/app/actions/support/changeSupportTicketPhotoAction"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoFileInput } from "@/components/form/ryogoFormFields"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FileRegex } from "@/lib/regex"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { FormContentWrapper, FormWrapper } from "@/components/page/pageWrappers"
import compressImage from "@/lib/imageCompression"
import { checkImageFileSize, checkImageFileType } from "@/lib/utils"

export default function ChangeTicketPhotoSheet({
  ticketId,
  userId,
  agencyId,
  newPhoto,
}: {
  ticketId: string
  userId: string
  agencyId: string
  newPhoto: boolean
}) {
  const t = useTranslations("Components.Sheets.ChangeTicketPhoto")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    photo: FileRegex.refine((file) => {
      return checkImageFileSize(file)
    }, t("Error1")).refine((file) => {
      return checkImageFileType(file)
    }, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: SchemaType) => {
    const compressedImage = await compressImage(values.photo)
    if (!compressedImage) {
      toast.error(t("Error1"))
      return
    }
    setOpen(false)
    const updatedTicket = await changeSupportTicketPhotoAction({
      ticketId,
      userId,
      agencyId,
      photo: compressedImage,
    })
    if (updatedTicket) {
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
        <FormWrapper
          form={form}
          id="changeTicketPhoto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoFileInput
              name={"photo"}
              register={form.register("photo")}
              label={t("Title")}
              placeholder={t("Placeholder")}
            />
          </FormContentWrapper>
        </FormWrapper>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeTicketPhoto"
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
