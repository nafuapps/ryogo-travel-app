import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import { FindAssignedUserByDriverIdType } from "@ryogo-travel-app/api/services/user.services"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import AgencyDetailsComponent from "@/components/flows/account/agencyDetailsComponent"
import AgencyInfoComponent from "@/components/flows/account/agencyInfoComponent"
import AgencyQRCodeComponent from "@/components/flows/account/agencyQRCodeComponent"
import AgencyAssignedUserComponent from "@/components/flows/account/agencyAssignedUserComponent"

export default function MyProfileAgencyDetailsPageComponent({
  agency,
  assignedUser,
}: {
  agency: NonNullable<FindAgencyByIdType>
  assignedUser: FindAssignedUserByDriverIdType
}) {
  return (
    <PageWrapper id="RiderMyProfileAgencyPage">
      <MyProfileDetailHeaderTabs selectedTab="Agency" />
      <GridWrapper id="AgencyDetails">
        <AgencyInfoComponent
          id={agency.id}
          logoUrl={agency.logoUrl}
          agencyName={agency.businessName}
          city={agency.location.city}
          state={agency.location.state}
          status={agency.status}
          isOwner={false}
        />
        <AgencyDetailsComponent
          id={agency.id}
          address={agency.businessAddress}
          email={agency.businessEmail}
          phone={agency.businessPhone}
          commission={agency.defaultCommissionRate}
          isRider={true}
          createdAt={agency.createdAt}
        />
      </GridWrapper>
      {agency.qrCodeUrl && (
        <AgencyQRCodeComponent
          agencyId={agency.id}
          qrCodeUrl={agency.qrCodeUrl}
          isOwner={false}
        />
      )}
      {assignedUser && (
        <AgencyAssignedUserComponent
          name={assignedUser.name}
          phone={assignedUser.phone}
          photoUrl={assignedUser.photoUrl}
        />
      )}
    </PageWrapper>
  )
}
