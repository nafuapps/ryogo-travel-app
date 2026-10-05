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
import { RyogoCaption } from "@/components/typography"
import { TOTAL_RATING_STARS } from "@/lib/uiConfig"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { FormWrapper, FormContentWrapper } from "@/components/page/pageWrappers"

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
  const t = useTranslations("Components.Sheets.CloseSupportTicket")
  const router = useRouter()
  const form = useForm()

  const [open, setOpen] = useState(false)

  const [rating, setRating] = useState(0)

  const onSubmit = async () => {
    const resolutionRating =
      rating > 0 && rating <= TOTAL_RATING_STARS ? rating : undefined
    const closedTicket = await closeSupportTicketAction({
      ticketId,
      userId,
      agencyId,
      status,
      resolutionRating,
    })
    if (closedTicket) {
      setOpen(false)
      toast.success(t("Success"))
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
        <FormWrapper
          form={form}
          id="closeSupportTicket"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoRatingInput
              name="rating"
              label={t("RatingLabel")}
              selectedStars={rating}
              setSelectedStars={setRating}
              totalStars={TOTAL_RATING_STARS}
            />
          </FormContentWrapper>
        </FormWrapper>
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
