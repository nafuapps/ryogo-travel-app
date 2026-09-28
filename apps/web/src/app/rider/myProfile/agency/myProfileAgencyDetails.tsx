import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { FindAssignedUserByDriverIdType } from "@ryogo-travel-app/api/services/user.services"
import {
  PageWrapper,
  GridWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import AgencyDetailsComponent from "@/components/flows/account/agencyDetailsComponent"
import AgencyInfoComponent from "@/components/flows/account/agencyInfoComponent"
import AgencyQRCodeComponent from "@/components/flows/account/agencyQRCodeComponent"
import AgencyAssignedUserComponent from "@/components/flows/account/agencyAssignedUserComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export default function MyProfileAgencyDetailsPageComponent({
  agency,
  assignedUser,
}: {
  agency: NonNullable<FindAgencyByIdType>
  assignedUser: FindAssignedUserByDriverIdType
}) {
  return (
    <PageWrapper id="RiderMyProfileAgencyPage">
      <GridWrapper id="AgencyDetails">
        <AgencyInfoComponent
          id={agency.id}
          logoUrl={agency.logoUrl}
          agencyName={agency.businessName}
          city={agency.location.city}
          state={agency.location.state}
          status={agency.status}
        />
        <AgencyDetailsComponent
          address={agency.businessAddress}
          email={agency.businessEmail}
          phone={agency.businessPhone}
          commission={agency.defaultCommissionRate}
          isRider={true}
          createdAt={agency.createdAt}
        />
      </GridWrapper>
      <AgencyQRCodeComponent
        qrCodeUrl={agency.qrCodeUrl}
        agencyId={agency.id}
      />
      {assignedUser && (
        <AgencyAssignedUserComponent
          name={assignedUser.name}
          phone={assignedUser.phone}
          photoUrl={assignedUser.photoUrl}
        />
      )}
      <StickyActionWrapper>
        <HelpIconButton
          href={"/rider/mySupport/help-account#agency"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
