"use client"

import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  RyogoRatingInput,
  RyogoOTPInput,
} from "@/components/form/ryogoFormFields"
import {
  FormWrapper,
  FormContentWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH3, RyogoSmall } from "@/components/typography"
import { DialogHeader } from "@/components/ui/dialog"
import { TOTAL_RATING_STARS } from "@/lib/uiConfig"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { rateBookingByDriverAction } from "@/app/actions/bookings/rateBookingByDriverAction"

export default function RateBookingByDriverDialog({
  bookingId,
  customerId,
  agencyId,
}: {
  bookingId: string
  customerId: string
  agencyId: string
}) {
  const t = useTranslations("Rider.MyBooking.RateBookingByDriver")

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [bookingRating, setBookingRating] = useState<number>(0)
  const [customerRating, setCustomerRating] = useState<number>(0)

  const formData = useForm()

  //Submit action
  const onSubmit = async () => {
    if (bookingRating === 0) {
      formData.setError("root", {
        type: "manual",
        message: t("SubmitError"),
      })
      setTimeout(() => {
        formData.clearErrors("root")
      }, 3000) //Clear the error after 3s
      return
    }

    startTransition(async () => {
      const result = await rateBookingByDriverAction(
        bookingId,
        customerId,
        agencyId,
        bookingRating,
        customerRating,
      )
      if (result) {
        toast.success(t("Success"))
        router.refresh()
      } else {
        setOpen(false)
        toast.error(t("Error"))
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <RyogoDefaultButton label={t("Title")} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <RyogoH3 weight="font-bold">{t("Title")}</RyogoH3>
          <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
        </DialogHeader>
        <FormWrapper
          id="ratingByDriver"
          onSubmit={formData.handleSubmit(onSubmit)}
          form={formData}
        >
          <FormContentWrapper asCard={false}>
            <RyogoRatingInput
              name="bookingRating"
              label={t("Field1.Title")}
              selectedStars={bookingRating}
              setSelectedStars={setBookingRating}
              totalStars={TOTAL_RATING_STARS}
            />
            <RyogoRatingInput
              name="customerRating"
              label={t("Field2.Title")}
              selectedStars={customerRating}
              setSelectedStars={setCustomerRating}
              totalStars={TOTAL_RATING_STARS}
            />
          </FormContentWrapper>
          {formData.formState.errors.root && (
            <RyogoCaption className="error-message" color="red">
              {formData.formState.errors.root.message}
            </RyogoCaption>
          )}
        </FormWrapper>
        <StickyActionWrapper bgTransparent>
          <RyogoDefaultButton
            type="submit"
            disabled={formData.formState.isSubmitting}
            showSpinner={formData.formState.isSubmitting}
            form="ratingByDriver"
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
          <RyogoGhostButton
            label={t("Back")}
            type="button"
            labelColor="light"
            disabled={formData.formState.isSubmitting}
            onClick={() => setOpen(false)}
          />
        </StickyActionWrapper>
      </DialogContent>
    </Dialog>
  )
}
