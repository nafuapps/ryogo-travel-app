import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import { FindAssignedUserByDriverIdType } from "@ryogo-travel-app/api/services/user.services"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import AgencyDetailsWrapper from "@/components/flows/account/agencyDetailsWrapper"
import AgencyInfoWrapper from "@/components/flows/account/agencyInfoWrapper"
import AgencyQRCodeWrapper from "@/components/flows/account/agencyQRCodeWrapper"
import AgencyAssignedUserWrapper from "@/components/flows/account/agencyAssignedUserWrapper"

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
        <AgencyInfoWrapper
          id={agency.id}
          logoUrl={agency.logoUrl}
          agencyName={agency.businessName}
          city={agency.location.city}
          state={agency.location.state}
          isOwner={false}
        />
        <AgencyDetailsWrapper
          id={agency.id}
          status={agency.status}
          address={agency.businessAddress}
          email={agency.businessEmail}
          phone={agency.businessPhone}
          commission={agency.defaultCommissionRate}
          isRider={true}
          createdAt={agency.createdAt}
        />
      </GridWrapper>
      {agency.qrCodeUrl && (
        <AgencyQRCodeWrapper
          agencyId={agency.id}
          qrCodeUrl={agency.qrCodeUrl}
          isOwner={false}
        />
      )}
      {assignedUser && (
        <AgencyAssignedUserWrapper
          name={assignedUser.name}
          phone={assignedUser.phone}
          photoUrl={assignedUser.photoUrl}
        />
      )}
    </PageWrapper>
  )
}
