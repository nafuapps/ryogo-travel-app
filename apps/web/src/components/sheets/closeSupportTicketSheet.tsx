"use client"

import { RyogoRatingInput } from "@/components/form/ryogoFormFields"
import { Button } from "@/components/ui/button"
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
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { closeSupportTicketAction } from "@/app/actions/support/closeSupportTicketAction"
import { TicketStatusEnum } from "@ryogo-travel-app/db/schema"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { RyogoCaption } from "@/components/typography"
import { TOTAL_RATING_STARS } from "@/lib/uiConfig"

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
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [resolutionRating, setResolutionRating] = useState(0)

  const formData = useForm()

  const onSubmit = async () => {
    const resolutionRatingData =
      resolutionRating > 0 && resolutionRating <= TOTAL_RATING_STARS
        ? resolutionRating
        : undefined
    startTransition(async () => {
      if (
        await closeSupportTicketAction(
          ticketId,
          userId,
          agencyId,
          status,
          resolutionRatingData,
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
        <Button variant="default" className="w-full">
          <RyogoCaption color="white">{t("Title")}</RyogoCaption>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
          <SheetDescription>
            <RyogoCaption color="light">{t("Warning")}</RyogoCaption>
          </SheetDescription>
        </SheetHeader>
        <Form {...formData}>
          <form
            id="closeSupportTicket"
            onSubmit={formData.handleSubmit(onSubmit)}
          >
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
          <Button type="submit" disabled={isPending} form="closeSupportTicket">
            {isPending ? t("Loading") : t("CloseTicket")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
