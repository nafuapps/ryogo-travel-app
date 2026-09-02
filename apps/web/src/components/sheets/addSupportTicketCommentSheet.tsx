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
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import z from "zod"
import { addUserCommentInSupportTicketAction } from "@/app/actions/support/addUserCommentInSupportTicketAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default function AddSupportTicketCommentSheet({
  ticketId,
  userId,
  agencyId,
  status,
}: {
  ticketId: string
  userId: string
  agencyId: string
  status: TicketStatusEnum
}) {
  const t = useTranslations("Sheets.AddSupportTicketComment")
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const schema = z.object({
    comment: z.string().max(300, t("FieldError")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    const addedComment = await addUserCommentInSupportTicketAction(
      ticketId,
      userId,
      agencyId,
      status,
      data.comment,
    )
    if (addedComment) {
      setOpen(false)
    } else {
      toast.error(t("Error"))
    }
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <RyogoOutlineButton className="w-full" label={t("Title")} />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form id="closeSupportTicket" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoTextarea name="comment" label={t("Title")} placeholder="" />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="closeSupportTicket"
            label={form.formState.isSubmitting ? t("Loading") : t("Save")}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
