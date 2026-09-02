"use client"

import { RyogoRatingInput } from "@/components/form/ryogoFormFields"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { closeSupportTicketAction } from "@/app/actions/support/closeSupportTicketAction"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { RyogoCaption } from "@/components/typography"
import { TOTAL_RATING_STARS } from "@/lib/uiConfig"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"

export default function CloseSupportTicketSheet({
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
  const t = useTranslations("Sheets.CloseSupportTicket")
  const router = useRouter()
  const form = useForm()

  const [open, setOpen] = useState(false)

  const [resolutionRating, setResolutionRating] = useState(0)

  const onSubmit = async () => {
    const resolutionRatingData =
      resolutionRating > 0 && resolutionRating <= TOTAL_RATING_STARS
        ? resolutionRating
        : undefined
    const closedTicket = await closeSupportTicketAction(
      ticketId,
      userId,
      agencyId,
      status,
      resolutionRatingData,
    )
    if (closedTicket) {
      setOpen(false)
    } else {
      toast.error(t("Error"))
    }
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <RyogoDefaultButton className="w-full" label={t("Title")} />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
          <SheetDescription>
            <RyogoCaption color="light">{t("Warning")}</RyogoCaption>
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form id="closeSupportTicket" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoRatingInput
                name="resolutionRating"
                label={t("RatingLabel")}
                selectedStars={resolutionRating}
                setSelectedStars={setResolutionRating}
                totalStars={TOTAL_RATING_STARS}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="closeSupportTicket"
            label={
              form.formState.isSubmitting ? t("Loading") : t("CloseTicket")
            }
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
