"use client"

import { resendBookingSecretCodeAction } from "@/app/actions/bookings/resendBookingSecretCodeAction"
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
import { useRefreshPage } from "@/hooks/useRefreshPage"
import { TOTAL_RATING_STARS } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { useRouter } from "next/navigation"
import { rateBookingByCustomerAction } from "@/app/actions/bookings/rateBookingByCustomerAction"
import { useBotDetection } from "@/hooks/useBotDetection"

export default function RateBookingByCustomerDialog({
  bookingId,
  driverId,
  vehicleId,
  codeSentOn,
}: {
  bookingId: string
  driverId: string
  vehicleId: string
  codeSentOn: Date | null
}) {
  const t = useTranslations("Track.RateBookingByCustomer")

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { checkBotActivity, isBot } = useBotDetection()

  const [bookingRating, setBookingRating] = useState<number>(0)
  const [driverRating, setDriverRating] = useState<number>(0)
  const [vehicleRating, setVehicleRating] = useState<number>(0)

  //Can resend code if either not sent before or sent more than X minutes ago
  const { canSend, refreshMinutes } = useRefreshPage(codeSentOn)

  const ratingSchema = z.object({
    userEnteredcode: z
      .string()
      .length(6, t("Field4.Error1"))
      .nonoptional(t("Field4.Error1")),
  })
  type RatingType = z.infer<typeof ratingSchema>
  const formData = useForm<RatingType>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      userEnteredcode: "",
    },
  })

  //Submit action
  const onSubmit = async (data: RatingType) => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
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
      const result = await rateBookingByCustomerAction({
        bookingId,
        driverId,
        vehicleId,
        code: data.userEnteredcode,
        bookingRatingByCustomer: bookingRating,
        driverRatingByCustomer: driverRating,
        vehicleRatingByCustomer: vehicleRating,
      })
      if (result) {
        if ("id" in result) {
          toast.success(t("Success"))
          router.refresh()
        } else {
          formData.setError("userEnteredcode", {
            type: "manual",
            message: t("APIError"),
          })
          setTimeout(() => {
            formData.setValue("userEnteredcode", "")
            formData.clearErrors("userEnteredcode")
          }, 3000) //Clear the field after 3s
        }
      } else {
        setOpen(false)
        toast.error(t("Error"))
      }
    })
  }

  //Resend code action
  const resendCode = async () => {
    if (checkBotActivity()) {
      toast.error(t("BotError"))
      return
    }
    startTransition(async () => {
      const result = await resendBookingSecretCodeAction(bookingId)
      if (result) {
        toast.success(t("ResendSuccess"))
      } else {
        toast.error(t("ResendError"))
      }
    })
    setTimeout(() => {
      formData.setValue("userEnteredcode", "")
    }, 1000) //Clear the field after 1s
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
        <FormWrapper<RatingType>
          id="ratingByCustomer"
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
              name="driverRating"
              label={t("Field2.Title")}
              selectedStars={driverRating}
              setSelectedStars={setDriverRating}
              totalStars={TOTAL_RATING_STARS}
            />
            <RyogoRatingInput
              name="vehicleRating"
              label={t("Field3.Title")}
              selectedStars={vehicleRating}
              setSelectedStars={setVehicleRating}
              totalStars={TOTAL_RATING_STARS}
            />
            <RyogoOTPInput
              name={"userEnteredcode"}
              label={t("Field4.Title")}
              description={t("Field4.Description")}
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
            disabled={formData.formState.isSubmitting || isBot}
            showSpinner={formData.formState.isSubmitting}
            form="ratingByCustomer"
            label={
              formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")
            }
          />
          <RyogoOutlineButton
            type="button"
            onClick={resendCode}
            disabled={isPending || !canSend || isBot}
            label={
              isPending
                ? t("Sending")
                : canSend
                  ? t("SecondaryCTA")
                  : t("Timeout", {
                      difference: refreshMinutes,
                    })
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
