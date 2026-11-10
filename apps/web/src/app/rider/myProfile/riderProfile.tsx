import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import AccountInfoComponent from "@/components/flows/account/accountInfoComponent"
import UserDetailsComponent from "@/components/flows/account/userDetailsComponent"
import UserDriverDetailsComponent from "@/components/flows/account/userDriverDetailsComponent"
import UserDriverLicenseInfoComponent from "@/components/flows/account/userDriverLicenseInfoComponent"
import UserLoginTimeComponent from "@/components/flows/account/userLoginTimeComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import {
  GridWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { FindUserDetailsWithDriverByIdType } from "@ryogo-travel-app/api/services/user.services"
import { Camera, KeyRound, MailPen } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function RiderProfilePageComponent({
  account,
  sessionLoginAt,
}: {
  account: NonNullable<FindUserDetailsWithDriverByIdType>
  sessionLoginAt: Date
}) {
  const t = await getTranslations("Rider.MyProfile")

  return (
    <PageWrapper id="RiderProfilePage">
      <GridWrapper id="RiderAccountDetails">
        <AccountInfoComponent
          id={account.id}
          agencyId={account.agencyId}
          photoUrl={account.photoUrl}
          name={account.name}
          agencyName={account.agency.businessName}
          status={account.status}
        />
        <UserDetailsComponent
          role={account.userRole}
          phone={account.phone}
          email={account.email}
          createdAt={account.createdAt}
        />
      </GridWrapper>
      {account.driver && (
        <GridWrapper id="RiderDriverDetails">
          <UserDriverLicenseInfoComponent
            licenseNumber={account.driver.licenseNumber}
            photoUrl={account.driver.licensePhotoUrl}
            expiryDate={account.driver.licenseExpiresOn}
          />
          <UserDriverDetailsComponent
            driverId={account.driver.id}
            address={account.driver.address}
            status={account.driver.status}
            canDriveVehicles={account.driver.canDriveVehicleTypes}
            allowance={account.driver.defaultAllowancePerDay}
            ratings={account.driver.customerRatings}
          />
        </GridWrapper>
      )}
      <GridWrapper id="RiderAccountActions">
        <ChangeUserPhotoSheet
          userId={account.id}
          agencyId={account.agencyId}
          canChange
        >
          <RyogoDetailedIconButton
            label={t("ChangeUserPhoto.Title")}
            icon={Camera}
            subtitle={t("ChangeUserPhoto.Subtitle")}
          />
        </ChangeUserPhotoSheet>
        <ChangeUserNameSheet
          userId={account.id}
          userName={account.name}
          userRole={account.userRole}
          agencyId={account.agencyId}
        />
        <Link href="/rider/myProfile/change-email" prefetch={false}>
          <RyogoDetailedIconButton
            label={t("ChangeEmail.Title")}
            icon={MailPen}
            subtitle={t("ChangeEmail.Subtitle")}
          />
        </Link>
        <Link href="/rider/myProfile/change-password" prefetch={false}>
          <RyogoDetailedIconButton
            label={t("ChangePassword.Title")}
            icon={KeyRound}
            subtitle={t("ChangePassword.Subtitle")}
          />
        </Link>
        <LogoutAlertButton />
      </GridWrapper>
      <UserLoginTimeComponent sessionLoginAt={sessionLoginAt} />
      <StickyActionWrapper>
        <HelpIconButton href={"/rider/mySupport/help-account"} showLabelSmall />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
