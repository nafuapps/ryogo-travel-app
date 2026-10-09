import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { IdCard } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsHeaderWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import ChangeDriverLicenseSheet from "@/components/sheets/changeDriverLicenseSheet"

export default async function DriverLicenseInfoComponent({
  id,
  agencyId,
  addedByUserId,
  licenseNumber,
  photoUrl,
  licenseExpiresOn,
  canChange,
}: {
  id: string
  agencyId: string
  addedByUserId: string
  licenseNumber: string | null
  photoUrl: string | null
  licenseExpiresOn: Date | null
  canChange: boolean
}) {
  const isExpired = licenseExpiresOn && licenseExpiresOn < new Date()
  const t = await getTranslations("Dashboard.DriverDetails.License")

  return (
    <SectionColWrapper className="items-center justify-center">
      <RyogoCaption color="light" weight="font-bold">
        {t("Title")}
      </RyogoCaption>
      {photoUrl ? (
        <RyogoDialogImage
          src={getFileUrl(photoUrl)}
          alt={photoUrl}
          imageSize="lg"
        />
      ) : (
        <ChangeDriverLicenseSheet
          driverId={id}
          agencyId={agencyId}
          addedByUserId={addedByUserId}
          lNumber={licenseNumber}
          lExpiresOn={licenseExpiresOn}
          canChange={canChange}
        >
          <RyogoEnclosedIcon icon={IdCard} size="lg" />
        </ChangeDriverLicenseSheet>
      )}
      <SectionColWrapper className="items-center">
        {licenseNumber && <RyogoP weight="font-bold">{licenseNumber}</RyogoP>}
        {licenseExpiresOn && (
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
                {moment(licenseExpiresOn).format("DD MMM YYYY")}
              </RyogoCaption>
            </div>
          </DetailsBorderWrapper>
        )}
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
