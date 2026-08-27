"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"

export default function QuickAddDriverAlertButton(props: {
  agencyId: string
  name: string
  email: string
  phone: string
  photo?: FileList
  disabled: boolean
  isOnboarding?: boolean
}) {
  const t = useTranslations("Dashboard.Buttons.QuickAddDriver")

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function quickAddDriver() {
    startTransition(async () => {
      const newDriverData: AddDriverRequestType = {
        agencyId: props.agencyId,
        data: {
          name: props.name,
          email: props.email,
          phone: props.phone,
          userPhotos: props.photo,
        },
      }
      const addedDriver = await addDriverAction(newDriverData)

      if (addedDriver) {
        toast.success(t("Success"))
        router.replace(
          props.isOnboarding
            ? `/onboarding/add-agent`
            : `/dashboard/drivers/${addedDriver.id}`,
        )
      } else {
        //If failed, show error
        toast.error(t("Error"))
      }
    })
  }

  return (
    <RyogoAlertDialog
      title={t("Title")}
      desc={t("Desc")}
      noCTA={t("NoCTA")}
      labelChild={
        <RyogoOutlineButton disabled={props.disabled} label={t("Label")} />
      }
    >
      <RyogoDefaultButton
        onClick={quickAddDriver}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}
