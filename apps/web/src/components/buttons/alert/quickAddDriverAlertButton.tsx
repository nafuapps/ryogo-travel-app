"use client"

import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Spinner } from "@/components/ui/spinner"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { RyogoCaption } from "@/components/typography"
import { addDriverAction } from "@/app/actions/drivers/addDriverAction"
import { AddDriverRequestType } from "@ryogo-travel-app/api/types/user.types"

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
        <Button variant={"outline"} disabled={props.disabled}>
          <RyogoCaption color="slate">{t("Label")}</RyogoCaption>
        </Button>
      }
    >
      <Button variant={"default"} onClick={quickAddDriver} disabled={isPending}>
        {isPending && <Spinner />}
        <RyogoCaption color="white">
          {isPending ? t("Loading") : t("YesCTA")}
        </RyogoCaption>
      </Button>
    </RyogoAlertDialog>
  )
}
