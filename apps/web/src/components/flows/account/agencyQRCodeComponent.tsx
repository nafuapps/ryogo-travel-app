import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"

export default async function AgencyQRCodeComponent({
  qrCodeUrl,
}: {
  qrCodeUrl: string
}) {
  const t = await getTranslations("Dashboard.AccountAgency")
  return (
    <SectionWrapper id="QRCodeSection" className="items-center">
      <RyogoCaption color="light" weight="font-bold">
        {t("QRCode")}
      </RyogoCaption>
      {qrCodeUrl && (
        <RyogoDialogImage
          src={getFileUrl(qrCodeUrl)}
          alt={qrCodeUrl}
          imageSize="lg"
        />
      )}
    </SectionWrapper>
  )
}
