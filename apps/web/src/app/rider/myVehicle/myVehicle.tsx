import VehicleDetailsComponent from "@/components/flows/vehicles/details/vehicleDetailsComponent"
import VehicleDocumentInfoComponent from "@/components/flows/vehicles/details/vehicleDocumentInfoComponent"
import VehicleInfoComponent from "@/components/flows/vehicles/details/vehicleInfoComponent"
import {
  SectionWrapper,
  PageWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { getTranslations } from "next-intl/server"

export default async function RiderMyVehiclePageComponent({
  vehicle,
}: {
  vehicle: FindAssignedVehicleByDriverIdType
}) {
  const t = await getTranslations("Rider.MyVehicle")

  if (!vehicle) {
    return (
      <PageWrapper id="VehicleDetailsPage">
        <SectionWrapper id="VehicleDetailsInfo">
          <RyogoCaption color="slate">{t("NoVehicleAssigned")}</RyogoCaption>
        </SectionWrapper>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper id="RiderVehicleDetailsPage">
      <GridWrapper id="VehicleDetails">
        <VehicleInfoComponent
          id={vehicle.id}
          agencyId={vehicle.agencyId}
          photoUrl={vehicle.vehiclePhotoUrl}
          vehicleNumber={vehicle.vehicleNumber}
          status={vehicle.status}
          type={vehicle.type}
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
    </PageWrapper>
  )
}
