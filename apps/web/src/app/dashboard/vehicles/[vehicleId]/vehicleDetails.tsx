import { FindVehicleDetailsByIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import VehicleDetailHeaderTabs from "@/components/header/detailHeaderTabs/vehicleDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { VehicleStatusEnum } from "@ryogo-travel-app/db/schema"
import ActivateVehicleAlertButton from "@/components/buttons/alert/activateVehicleAlertButton"
import InactivateVehicleAlertButton from "@/components/buttons/alert/inactivateVehicleAlertButton"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import {
  Camera,
  FileDigit,
  Hash,
  SquarePen,
  Umbrella,
  WavesVertical,
} from "lucide-react"
import VehicleInfoComponent from "@/components/flows/vehicles/details/vehicleInfoComponent"
import VehicleDetailsComponent from "@/components/flows/vehicles/details/vehicleDetailsComponent"
import VehicleDocumentInfoComponent from "@/components/flows/vehicles/details/vehicleDocumentInfoComponent"
import ChangeVehiclePhotoSheet from "@/components/sheets/changeVehiclePhotoSheet"
import ChangeVehicleDocumentSheet from "@/components/sheets/changeVehicleDocumentSheet"
import { GoogleMapsEmbedPlaceComponent } from "@/components/maps/googleMapsEmbed"

export default async function VehicleDetailsPageComponent({
  vehicle,
  userId,
  isOwner,
}: {
  vehicle: NonNullable<FindVehicleDetailsByIdType>
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.VehicleDetails")

  const canChangeDetails = vehicle.addedByUserId === userId || isOwner

  return (
    <PageWrapper id="VehicleDetailsPage">
      <VehicleDetailHeaderTabs selectedTab={"Vehicle"} id={vehicle.id} />
      <GridWrapper id="VehicleDetails">
        <VehicleInfoComponent
          id={vehicle.id}
          agencyId={vehicle.agencyId}
          photoUrl={vehicle.vehiclePhotoUrl}
          vehicleNumber={vehicle.vehicleNumber}
          status={vehicle.status}
          type={vehicle.type}
          canChange={canChangeDetails}
        />
        <VehicleDetailsComponent
          createdAt={vehicle.createdAt}
          type={vehicle.type}
          brand={vehicle.brand}
          color={vehicle.color}
          model={vehicle.model}
          odometer={vehicle.odometerReading}
          capacity={vehicle.capacity}
          hasAC={vehicle.hasAC}
          rate={vehicle.defaultRatePerKm}
          acCharge={vehicle.defaultAcChargePerDay}
          ratings={vehicle.customerRatings}
        />
      </GridWrapper>
      {vehicle.latLong && (
        <SectionWrapper id="VehicleLocationDetails">
          <GoogleMapsEmbedPlaceComponent
            latLong={vehicle.latLong}
            time={vehicle.locatedAt}
          />
        </SectionWrapper>
      )}
      <SectionWrapper id="VehicleRCDetails">
        <VehicleDocumentInfoComponent
          id={vehicle.id}
          agencyId={vehicle.agencyId}
          addedByUserId={vehicle.addedByUserId}
          canChange={canChangeDetails}
          label={t("RC")}
          type="rc"
          photoUrl={vehicle.rcPhotoUrl}
          expiresOn={vehicle.rcExpiresOn}
        />
      </SectionWrapper>
      <SectionWrapper id="VehiclePUCDetails">
        <VehicleDocumentInfoComponent
          id={vehicle.id}
          agencyId={vehicle.agencyId}
          addedByUserId={vehicle.addedByUserId}
          canChange={canChangeDetails}
          label={t("PUC")}
          type="puc"
          photoUrl={vehicle.pucPhotoUrl}
          expiresOn={vehicle.pucExpiresOn}
        />
      </SectionWrapper>
      <SectionWrapper id="VehicleInsuranceDetails">
        <VehicleDocumentInfoComponent
          id={vehicle.id}
          agencyId={vehicle.agencyId}
          addedByUserId={vehicle.addedByUserId}
          canChange={canChangeDetails}
          label={t("Insurance")}
          type="insurance"
          photoUrl={vehicle.insurancePhotoUrl}
          expiresOn={vehicle.insuranceExpiresOn}
        />
      </SectionWrapper>
      {canChangeDetails && (
        <GridWrapper id="VehicleActions">
          <ChangeVehiclePhotoSheet
            vehicleId={vehicle.id}
            agencyId={vehicle.agencyId}
            canChange
          >
            <RyogoDetailedIconButton
              label={t("ChangeVehiclePhoto.Button")}
              icon={Camera}
              subtitle={t("ChangeVehiclePhoto.Subtitle")}
            />
          </ChangeVehiclePhotoSheet>
          <Link href={`/dashboard/vehicles/${vehicle.id}/change-number`}>
            <RyogoDetailedIconButton
              label={t("ChangeVehicleNumber.Title")}
              icon={Hash}
              subtitle={t("ChangeVehicleNumber.Subtitle")}
            />
          </Link>
          <ChangeVehicleDocumentSheet
            vehicleId={vehicle.id}
            agencyId={vehicle.agencyId}
            addedByUserId={vehicle.addedByUserId}
            documentType="rc"
            expiresOn={vehicle.rcExpiresOn}
            canChange
          >
            <RyogoDetailedIconButton
              label={t("ChangeDocument.TitleRC")}
              icon={FileDigit}
              subtitle={t("ChangeDocument.SubtitleRC")}
            />
          </ChangeVehicleDocumentSheet>
          <ChangeVehicleDocumentSheet
            vehicleId={vehicle.id}
            agencyId={vehicle.agencyId}
            addedByUserId={vehicle.addedByUserId}
            documentType="puc"
            expiresOn={vehicle.pucExpiresOn}
            canChange
          >
            <RyogoDetailedIconButton
              label={t("ChangeDocument.TitlePUC")}
              icon={WavesVertical}
              subtitle={t("ChangeDocument.SubtitlePUC")}
            />
          </ChangeVehicleDocumentSheet>
          <ChangeVehicleDocumentSheet
            vehicleId={vehicle.id}
            agencyId={vehicle.agencyId}
            addedByUserId={vehicle.addedByUserId}
            documentType="insurance"
            expiresOn={vehicle.insuranceExpiresOn}
            canChange
          >
            <RyogoDetailedIconButton
              label={t("ChangeDocument.TitleInsurance")}
              icon={Umbrella}
              subtitle={t("ChangeDocument.SubtitleInsurance")}
            />
          </ChangeVehicleDocumentSheet>
          <Link href={`/dashboard/vehicles/${vehicle.id}/modify`}>
            <RyogoDetailedIconButton
              label={t("EditDetails.Title")}
              icon={SquarePen}
              subtitle={t("EditDetails.Subtitle")}
            />
          </Link>
          {vehicle.status !== VehicleStatusEnum.INACTIVE ? (
            <InactivateVehicleAlertButton
              vehicleId={vehicle.id}
              agencyId={vehicle.agencyId}
            />
          ) : (
            <ActivateVehicleAlertButton
              vehicleId={vehicle.id}
              agencyId={vehicle.agencyId}
            />
          )}
        </GridWrapper>
      )}
    </PageWrapper>
  )
}
