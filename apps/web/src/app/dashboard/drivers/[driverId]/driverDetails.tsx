import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { Camera, SquarePen } from "lucide-react"
import Link from "next/link"
import InactivateDriverAlertButton from "@/components/buttons/alert/inactivateDriverAlertButton"
import ActivateDriverAlertButton from "@/components/buttons/alert/activateDriverAlertButton"
import { DriverStatusEnum, UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  PageWrapper,
  GridWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import DriverInfoComponent from "@/components/flows/drivers/details/driverInfoComponent"
import DriverDetailsComponent from "@/components/flows/drivers/details/driverDetailsComponent"
import DriverLicenseInfoComponent from "@/components/flows/drivers/details/driverLicenseInfoComponent"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import ChangeDriverLicenseSheet from "@/components/sheets/changeDriverLicenseSheet"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import { GoogleMapsEmbedPlaceComponent } from "@/components/maps/googleMapsEmbed"

export default async function DriverDetailsPageComponent({
  driver,
  userId,
  isOwner,
}: {
  driver: NonNullable<FindDriverDetailsByIdType>
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.DriverDetails")

  const canChangeDetails = driver.addedByUserId === userId || isOwner

  return (
    <PageWrapper id="DriverDetailsPage">
      <DriverDetailHeaderTabs selectedTab={"Driver"} id={driver.id} />
      <GridWrapper id="DriverDetails">
        <DriverInfoComponent
          id={driver.id}
          photoUrl={driver.user.photoUrl}
          name={driver.name}
          status={driver.status}
          userId={driver.userId}
          agencyId={driver.agencyId}
          canChange={canChangeDetails}
        />
        <DriverDetailsComponent
          userId={driver.userId}
          createdAt={driver.createdAt}
          phone={driver.phone}
          email={driver.user.email}
          address={driver.address}
          allowance={driver.defaultAllowancePerDay}
          canDriveVehicles={driver.canDriveVehicleTypes}
          ratings={driver.customerRatings}
        />
      </GridWrapper>
      {driver.latLong && (
        <SectionWrapper id="DriverLocationDetails">
          <GoogleMapsEmbedPlaceComponent
            latLong={driver.latLong}
            time={driver.locatedAt}
          />
        </SectionWrapper>
      )}
      <SectionWrapper id="DriverLicenseDetails">
        <DriverLicenseInfoComponent
          licenseNumber={driver.licenseNumber}
          photoUrl={driver.licensePhotoUrl}
          licenseExpiresOn={driver.licenseExpiresOn}
        />
      </SectionWrapper>
      <GridWrapper id="DriverCommunication">
        <RyogoPhoneButton label={t("CallDriver")} phone={driver.phone} />
        <RyogoChatButton
          label={t("ChatDriver.Title")}
          phone={driver.phone}
          subtitle={t("ChatDriver.Subtitle")}
        />
      </GridWrapper>
      {canChangeDetails && (
        <GridWrapper id="DriverActions">
          <ChangeUserPhotoSheet
            userId={driver.userId}
            agencyId={driver.agencyId}
            canChange
          >
            <RyogoDetailedIconButton
              label={t("ChangeDriverPhoto.Title")}
              icon={Camera}
              subtitle={t("ChangeDriverPhoto.Subtitle")}
            />
          </ChangeUserPhotoSheet>
          <ChangeUserNameSheet
            userId={driver.userId}
            userName={driver.name}
            userRole={UserRolesEnum.DRIVER}
            agencyId={driver.agencyId}
          />
          <ChangeDriverLicenseSheet
            driverId={driver.id}
            agencyId={driver.agencyId}
            addedByUserId={driver.addedByUserId}
            lNumber={driver.licenseNumber}
            lExpiresOn={driver.licenseExpiresOn}
          />
          <Link href={`/dashboard/drivers/${driver.id}/modify`}>
            <RyogoDetailedIconButton
              label={t("EditDetails.Title")}
              icon={SquarePen}
              subtitle={t("EditDetails.Subtitle")}
            />
          </Link>
          {driver.status !== DriverStatusEnum.INACTIVE ? (
            <InactivateDriverAlertButton
              driverId={driver.id}
              agencyId={driver.agencyId}
            />
          ) : (
            <ActivateDriverAlertButton
              driverId={driver.id}
              userId={driver.userId}
              agencyId={driver.agencyId}
            />
          )}
        </GridWrapper>
      )}
    </PageWrapper>
  )
}
