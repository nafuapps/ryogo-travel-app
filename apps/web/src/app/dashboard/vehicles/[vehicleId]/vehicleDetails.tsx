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
import { Camera, Hash, SquarePen } from "lucide-react"
import VehicleInfoComponent from "@/components/flows/vehicles/details/vehicleInfoComponent"
import VehicleDetailsComponent from "@/components/flows/vehicles/details/vehicleDetailsComponent"
import VehicleDocumentInfoComponent from "@/components/flows/vehicles/details/vehicleDocumentInfoComponent"
import ChangeVehiclePhotoSheet from "@/components/sheets/changeVehiclePhotoSheet"
import ChangeVehicleDocumentSheet from "@/components/sheets/changeVehicleDocumentSheet"

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
      <SectionWrapper id="VehicleRCDetails">
        <VehicleDocumentInfoComponent
          label={t("RC")}
          photoUrl={vehicle.rcPhotoUrl}
          expiresOn={vehicle.rcExpiresOn}
        />
      </SectionWrapper>
      <SectionWrapper id="VehiclePUCDetails">
        <VehicleDocumentInfoComponent
          label={t("PUC")}
          photoUrl={vehicle.pucPhotoUrl}
          expiresOn={vehicle.pucExpiresOn}
        />
      </SectionWrapper>
      <SectionWrapper id="VehicleInsuranceDetails">
        <VehicleDocumentInfoComponent
          label={t("Insurance")}
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
          />
          <ChangeVehicleDocumentSheet
            vehicleId={vehicle.id}
            agencyId={vehicle.agencyId}
            addedByUserId={vehicle.addedByUserId}
            documentType="puc"
            expiresOn={vehicle.pucExpiresOn}
          />
          <ChangeVehicleDocumentSheet
            vehicleId={vehicle.id}
            agencyId={vehicle.agencyId}
            addedByUserId={vehicle.addedByUserId}
            documentType="insurance"
            expiresOn={vehicle.insuranceExpiresOn}
          />
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
