import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  AccountDetailsBorderWrapper,
  AccountInfoContentWrapper,
  AccountInfoWrapper,
} from "./accountCommon"

export default async function LicenseInfoWrapper({
  licenseNumber,
  photoUrl,
  expiryDate,
}: {
  licenseNumber: string | null
  photoUrl: string | null
  expiryDate: Date | null
}) {
  const isExpired = expiryDate && expiryDate < new Date()
  const t = await getTranslations("Rider.MyProfile")

  return (
    <AccountInfoWrapper>
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <RyogoEnclosedIcon icon={IdCard} size="xl" />
      )}
      <AccountInfoContentWrapper>
        <RyogoCaption color="light">{t("License")}</RyogoCaption>
        {licenseNumber && <RyogoP>{licenseNumber}</RyogoP>}
        {expiryDate && (
          <AccountDetailsBorderWrapper>
            <div className="bg-slate-200 dark:bg-slate-800 py-1 lg:py-1.5 px-3 lg:px-4">
              <RyogoCaption color="light" className="text-center">
                {isExpired ? t("ExpiredOn") : t("ExpiresOn")}
              </RyogoCaption>
            </div>
            <div className="py-1 lg:py-1.5 px-3 lg:px-4">
              <RyogoCaption
                color={isExpired ? "red" : "slate"}
                className="text-center"
              >
                {moment(expiryDate).format("DD MMM YYYY")}
              </RyogoCaption>
            </div>
          </AccountDetailsBorderWrapper>
        )}
      </AccountInfoContentWrapper>
    </AccountInfoWrapper>
  )
}
