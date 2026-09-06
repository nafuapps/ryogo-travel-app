import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { Scale } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function BookingReconcileCard({
  id,
  reconciledAt,
}: {
  id: string
  reconciledAt: Date | null
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  if (reconciledAt) {
    return (
      <div className="flex flex-row gap-2 lg:gap-3 p-2 lg:p-3 items-center justify-center">
        <RyogoEnclosedIcon icon={Scale} size="sm" color="black" />
        <SectionColWrapper wFull small>
          <RyogoCaption color="light">{t("ReconciledAt")}</RyogoCaption>
          <RyogoSmall color="slate">
            {moment(reconciledAt).format("DD MMM YYYY - hh:mm a")}
          </RyogoSmall>
        </SectionColWrapper>
      </div>
    )
  }

  return (
    <Link href={`/dashboard/bookings/${id}/reconcile`}>
      <RyogoDetailedIconButton
        label={t("Reconcile.Title")}
        icon={Scale}
        subtitle={t("Reconcile.Subtitle")}
      />
    </Link>
  )
}
