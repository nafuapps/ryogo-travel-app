"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import {
  RyogoOutlineButton,
  RyogoDefaultButton,
} from "@/components/buttons/ryogoButtons"

export default function QuickAddDriverAlertButton({
  agencyId,
  addedByUserId,
  name,
  email,
  phone,
  photo,
  disabled,
  isOnboarding,
  agencyName,
}: {
  agencyId: string
  addedByUserId: string
  name: string
  email: string
  phone: string
  photo?: FileList
  disabled: boolean
  isOnboarding?: boolean
  agencyName?: string
}) {
  const t = useTranslations("Dashboard.Buttons.QuickAddDriver")

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function quickAddDriver() {
    startTransition(async () => {
      const addedDriver = await addDriverAction({
        data: {
          agencyId: agencyId,
          addedByUserId: addedByUserId,
          name: name,
          email: email,
          phone: phone,
          userPhotos: photo,
        },
        agencyName,
      })

      if (addedDriver) {
        toast.success(t("Success"))
        router.replace(
          isOnboarding
            ? `/onboarding/add-agent`
            : `/dashboard/drivers/${addedDriver.id}?feedback=true`,
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
        <RyogoOutlineButton
          disabled={disabled}
          label={t("Label")}
          labelColor="brand"
          size={"lg"}
        />
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
