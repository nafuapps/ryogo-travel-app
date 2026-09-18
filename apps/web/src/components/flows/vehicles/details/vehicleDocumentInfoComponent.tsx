import { RyogoCaption } from "@/components/typography"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoDialogImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { FileDigit, Umbrella, WavesVertical } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsHeaderWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import ChangeVehicleDocumentSheet from "@/components/sheets/changeVehicleDocumentSheet"

export default async function VehiclDocumentInfoComponent({
  id,
  agencyId,
  addedByUserId,
  label,
  type,
  photoUrl,
  expiresOn,
  canChange,
}: {
  id: string
  agencyId: string
  addedByUserId: string
  label: string
  type: "rc" | "insurance" | "puc"
  photoUrl: string | null
  expiresOn: Date | null
  canChange?: boolean
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
        <ChangeVehicleDocumentSheet
          vehicleId={id}
          agencyId={agencyId}
          addedByUserId={addedByUserId}
          documentType={type}
          expiresOn={expiresOn}
          canChange={canChange}
        >
          <RyogoEnclosedIcon
            icon={
              type === "rc"
                ? FileDigit
                : type === "puc"
                  ? WavesVertical
                  : Umbrella
            }
            size="lg"
          />
        </ChangeVehicleDocumentSheet>
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
