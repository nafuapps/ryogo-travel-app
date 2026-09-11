import { FindDriverDetailsByIdType } from "@ryogo-travel-app/api/services/driver.services"
import DriverDetailHeaderTabs from "@/components/header/detailHeaderTabs/driverDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { SquarePen } from "lucide-react"
import Link from "next/link"
import InactivateDriverAlertButton from "@/components/buttons/alert/inactivateDriverAlertButton"
import ActivateDriverAlertButton from "@/components/buttons/alert/activateDriverAlertButton"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
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
          userId={driver.userId}
          photoUrl={driver.user.photoUrl}
          agencyId={driver.agencyId}
          name={driver.name}
          status={driver.status}
          canChangePhoto={canChangeDetails}
        />
        <DriverDetailsComponent
          id={driver.id}
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
      <SectionWrapper id="DriverLicenseDetails">
        <DriverLicenseInfoComponent
          driverId={driver.id}
          agencyId={driver.agencyId}
          addedByUserId={driver.addedByUserId}
          licenseNumber={driver.licenseNumber}
          photoUrl={driver.licensePhotoUrl}
          licenseExpiresOn={driver.licenseExpiresOn}
          canEdit={canChangeDetails}
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
