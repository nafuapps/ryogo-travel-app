import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { SectionWrapper } from "@/components/page/pageWrappers"
import ChangeQRCodeSheet from "@/components/sheets/changeQRCodeSheet"
import { RyogoCaption } from "@/components/typography"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { QrCode } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function AgencyQRCodeComponent({
  agencyId,
  qrCodeUrl,
  canChange,
}: {
  agencyId: string
  qrCodeUrl: string | null
  canChange?: boolean
}) {
  const t = await getTranslations("Dashboard.AccountAgency")
  return (
    <SectionWrapper id="QRCodeSection" className="items-center">
      <RyogoCaption color="light" weight="font-bold">
        {t("QRCode")}
      </RyogoCaption>
      {qrCodeUrl ? (
        <RyogoDialogImage
          src={getFileUrl(qrCodeUrl)}
          alt={qrCodeUrl}
          imageSize="lg"
        />
      ) : (
        <ChangeQRCodeSheet canChange={canChange} agencyId={agencyId} isNewPhoto>
          <RyogoEnclosedIcon icon={QrCode} size="lg" />
        </ChangeQRCodeSheet>
      )}
    </SectionWrapper>
  )
}
