import { HelpIconButton } from "@/components/flows/support/helpButtons"
import VehicleDetailsComponent from "@/components/flows/vehicles/details/vehicleDetailsComponent"
import VehicleDocumentInfoComponent from "@/components/flows/vehicles/details/vehicleDocumentInfoComponent"
import VehicleInfoComponent from "@/components/flows/vehicles/details/vehicleInfoComponent"
import EmptyStateIcon from "@/components/icons/emptyStateIcon"
import { GoogleMapsEmbedPlaceComponent } from "@/components/maps/googleMapsEmbed"
import {
  SectionWrapper,
  PageWrapper,
  GridWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { FindAssignedVehicleByDriverIdType } from "@ryogo-travel-app/api/services/vehicle.services"
import { ClipboardX } from "lucide-react"
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
        <SectionWrapper id="NoVehicleAssigned">
          <EmptyStateIcon icon={ClipboardX} label={t("NoVehicleAssigned")} />
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
          brand={vehicle.brand}
          model={vehicle.model}
          type={vehicle.type}
        />
        <VehicleDetailsComponent
          createdAt={vehicle.createdAt}
          type={vehicle.type}
          color={vehicle.color}
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
          label={t("Insurance")}
          type="insurance"
          photoUrl={vehicle.insurancePhotoUrl}
          expiresOn={vehicle.insuranceExpiresOn}
        />
      </SectionWrapper>
      <StickyActionWrapper>
        <HelpIconButton href={"/rider/mySupport/help-vehicle"} showLabelSmall />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
