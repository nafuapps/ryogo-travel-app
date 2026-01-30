"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { cancelBookingAction } from "@/app/actions/cancelBookingAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"

type CancelBookingAlertButtonProps = {
  bookingId: string
}
export default function CancelBookingAlertButton(
  props: CancelBookingAlertButtonProps,
) {
  const [isCancelPending, startCancelTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.CancelBooking")
  const router = useRouter()

  //Cancel booking
  async function cancel() {
    startCancelTransition(async () => {
      //If cancel is successful, show cancel success message and redirect to cancelled booking details
      if (await cancelBookingAction(props.bookingId)) {
        toast.success(t("Success"))
        router.replace(`/dashboard/bookings/${props.bookingId}`)
      } else {
        //If cancel is not successful, show error message
        toast.error(t("Error"))
      }
    })
  }

  return (
    <BookingAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={<Button variant={"secondary"}>{t("Label")}</Button>}
    >
      <Button
        variant={"destructive"}
        onClick={cancel}
        disabled={isCancelPending}
      >
        {isCancelPending && <Spinner />}
        {isCancelPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}
