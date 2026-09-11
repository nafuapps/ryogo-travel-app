import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  InfoContentWrapper,
  InfoWrapper,
} from "@/components/page/pageWrappers"
import ChangeDriverLicenseSheet from "@/components/sheets/changeDriverLicenseSheet"

export default async function DriverLicenseInfoComponent({
  driverId,
  agencyId,
  addedByUserId,
  licenseNumber,
  photoUrl,
  licenseExpiresOn,
  canEdit,
}: {
  driverId: string
  agencyId: string
  addedByUserId: string
  licenseNumber: string | null
  photoUrl: string | null
  licenseExpiresOn: Date | null
  canEdit: boolean
}) {
  const isExpired = licenseExpiresOn && licenseExpiresOn < new Date()
  const t = await getTranslations("Rider.MyProfile")

  return (
    <InfoWrapper>
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <RyogoEnclosedIcon icon={IdCard} size="xl" />
      )}
      <InfoContentWrapper>
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
        {canEdit && (
          <ChangeDriverLicenseSheet
            driverId={driverId}
            agencyId={agencyId}
            addedByUserId={addedByUserId}
            lNumber={licenseNumber}
            lExpiresOn={licenseExpiresOn}
          />
        )}
      </InfoContentWrapper>
    </InfoWrapper>
  )
}
