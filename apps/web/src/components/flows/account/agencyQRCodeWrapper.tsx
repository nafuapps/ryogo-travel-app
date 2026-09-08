import { RyogoDialogImage } from "@/components/images/ryogoImage"
import {
  SectionWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import ChangeQRCodeSheet from "@/components/sheets/changeQRCodeSheet"
import { RyogoCaption } from "@/components/typography"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"

export default async function AgencyQRCodeWrapper({
  agencyId,
  qrCodeUrl,
  isOwner,
}: {
  agencyId: string
  qrCodeUrl: string | null
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.AccountAgency")
  return (
    <SectionWrapper id="QRCodeSection" center>
      <SectionColWrapper center>
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
        {isOwner && (
          <ChangeQRCodeSheet
            agencyId={agencyId}
            newPhoto={qrCodeUrl ? false : true}
          />
        )}
      </SectionColWrapper>
    </SectionWrapper>
  )
}
