"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import BookingAlertDialog from "./bookingAlertDialog"
import { inactivateVehicleAction } from "@/app/actions/vehicles/inactivateVehicleAction"

type InactivateVehicleAlertButtonProps = {
  vehicleId: string
  agencyId: string
}
export default function InactivateVehicleAlertButton(
  props: InactivateVehicleAlertButtonProps,
) {
  const t = useTranslations("Dashboard.Buttons.InactivateVehicle")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function inactivate() {
    startTransition(async () => {
      if (await inactivateVehicleAction(props.vehicleId, props.agencyId)) {
        toast.success(t("Success"))
        router.refresh()
      } else {
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
      <Button variant={"destructive"} onClick={inactivate} disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? t("Loading") : t("YesCTA")}
      </Button>
    </BookingAlertDialog>
  )
}
