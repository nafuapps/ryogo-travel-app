import { getTranslations } from "next-intl/server"
import { Camera, KeyRound, MailPen } from "lucide-react"
import Link from "next/link"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import { FindUserDetailsWithDriverByIdType } from "@ryogo-travel-app/api/services/user.services"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import AccountInfoComponent from "@/components/flows/account/accountInfoComponent"
import UserDetailsComponent from "@/components/flows/account/userDetailsComponent"
import UserDriverDetailsComponent from "@/components/flows/account/userDriverDetailsComponent"
import UserDriverLicenseInfoComponent from "@/components/flows/account/userDriverLicenseInfoComponent"
import UserLoginTimeComponent from "@/components/flows/account/userLoginTimeComponent"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"

export default async function RiderProfilePageComponent({
  account,
}: {
  account: NonNullable<FindUserDetailsWithDriverByIdType>
}) {
  const t = await getTranslations("Rider.MyProfile")

  return (
    <PageWrapper id="RiderProfilePage">
      <MyProfileDetailHeaderTabs selectedTab={"Account"} />
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
        <Link href="/rider/myProfile/change-email">
          <RyogoDetailedIconButton
            label={t("ChangeEmail.Title")}
            icon={MailPen}
            subtitle={t("ChangeEmail.Subtitle")}
          />
        </Link>
        <Link href="/rider/myProfile/change-password">
          <RyogoDetailedIconButton
            label={t("ChangePassword.Title")}
            icon={KeyRound}
            subtitle={t("ChangePassword.Subtitle")}
          />
        </Link>
        <LogoutAlertButton />
      </GridWrapper>
      {account.lastLogin && (
        <UserLoginTimeComponent lastLoginTime={account.lastLogin} />
      )}
    </PageWrapper>
  )
}
