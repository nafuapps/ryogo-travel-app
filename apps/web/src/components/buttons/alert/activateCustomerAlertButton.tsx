"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import RyogoAlertDialog from "./ryogoAlertDialog"
import { activateCustomerAction } from "@/app/actions/customers/activateCustomerAction"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { Zap } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default function ActivateCustomerAlertButton({
  customerId,
  agencyId,
}: {
  customerId: string
  agencyId: string
}) {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("Dashboard.Buttons.ActivateCustomer")
  const router = useRouter()

  async function activate() {
    startTransition(async () => {
      if (await activateCustomerAction(customerId, agencyId)) {
        toast.success(t("Success"))
        router.refresh()
      } else {
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
        <RyogoDetailedIconButton
          label={t("Label")}
          icon={Zap}
          subtitle={t("Subtitle")}
        />
      }
    >
      <RyogoDefaultButton
        onClick={activate}
        disabled={isPending}
        showSpinner={isPending}
        label={isPending ? t("Loading") : t("YesCTA")}
      />
    </RyogoAlertDialog>
  )
}
