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
        <RyogoEnclosedIcon icon={IdCard} size="lg" />
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
