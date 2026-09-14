import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"

export default async function DriverLicenseInfoComponent({
  licenseNumber,
  photoUrl,
  licenseExpiresOn,
}: {
  licenseNumber: string | null
  photoUrl: string | null
  licenseExpiresOn: Date | null
}) {
  const isExpired = licenseExpiresOn && licenseExpiresOn < new Date()
  const t = await getTranslations("Rider.MyProfile")

  return (
    <SectionColWrapper className="items-center justify-center">
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <RyogoEnclosedIcon icon={IdCard} size="xl" />
      )}
      <SectionColWrapper small className="items-center">
        {licenseNumber && <RyogoP>{licenseNumber}</RyogoP>}
        {licenseExpiresOn && (
          <DetailsBorderWrapper>
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
                {moment(licenseExpiresOn).format("DD MMM YYYY")}
              </RyogoCaption>
            </div>
          </DetailsBorderWrapper>
        )}
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
