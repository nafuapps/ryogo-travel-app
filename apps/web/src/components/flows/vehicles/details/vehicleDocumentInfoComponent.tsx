import { RyogoCaption } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { WalletCards } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsHeaderWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"

export default async function VehiclDocumentInfoComponent({
  label,
  photoUrl,
  expiresOn,
}: {
  label: string
  photoUrl: string | null
  expiresOn: Date | null
}) {
  const isExpired = expiresOn && expiresOn < new Date()
  const t = await getTranslations("Dashboard.VehicleDetails")

  return (
    <SectionColWrapper className="items-center justify-center">
      <RyogoCaption color="light" weight="font-bold">
        {label}
      </RyogoCaption>
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <RyogoEnclosedIcon icon={WalletCards} size="lg" />
      )}
      <SectionColWrapper small className="items-center">
        {expiresOn && (
          <DetailsBorderWrapper>
            <DetailsHeaderWrapper>
              <RyogoCaption color="light" className="text-center grow">
                {t("ValidTill")}
              </RyogoCaption>
            </DetailsHeaderWrapper>
            <div className="py-1 lg:py-1.5 px-3 lg:px-4">
              <RyogoCaption
                color={isExpired ? "red" : "slate"}
                className="text-center"
              >
                {moment(expiresOn).format("DD MMM YYYY")}
              </RyogoCaption>
            </div>
          </DetailsBorderWrapper>
        )}
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
