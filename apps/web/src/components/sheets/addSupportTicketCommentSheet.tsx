"use client"

import { RyogoTextarea } from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { RyogoCaption } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import z from "zod"
import { addUserCommentInSupportTicketAction } from "@/app/actions/support/addUserCommentInSupportTicketAction"

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
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const schema = z.object({
    comment: z.string().max(300, t("FieldError")),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    startTransition(async () => {
      if (
        await addUserCommentInSupportTicketAction(
          ticketId,
          userId,
          agencyId,
          status,
          data.comment,
        )
      ) {
        setOpen(false)
      } else {
        toast.error(t("Error"))
      }
      router.refresh()
    })
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <RyogoCaption>{t("Title")}</RyogoCaption>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <Form {...formData}>
          <form
            id="closeSupportTicket"
            onSubmit={formData.handleSubmit(onSubmit)}
          >
            <div className="p-4 lg:p-5">
              <RyogoTextarea name="comment" label={t("Title")} placeholder="" />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <Button type="submit" disabled={isPending} form="closeSupportTicket">
            {isPending ? t("Loading") : t("Save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
