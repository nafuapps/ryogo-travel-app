import { getTranslations } from "next-intl/server"
import { KeyRound, MailPen } from "lucide-react"
import { RyogoCaption } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import { FindUserDetailsWithDriverByIdType } from "@ryogo-travel-app/api/services/user.services"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import UserInfoComponent from "@/components/flows/account/userInfoComponent"
import UserDetailsComponent from "@/components/flows/account/userDetailsComponent"
import UserDriverDetailsComponent from "@/components/flows/account/userDriverDetailsComponent"
import UserDriverLicenseInfoComponent from "@/components/flows/account/userDriverLicenseInfoComponent"

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
        <UserInfoComponent
          id={account.id}
          photoUrl={account.photoUrl}
          agencyId={account.agencyId}
          name={account.name}
          agencyName={account.agency.businessName}
          status={account.status}
        />
        <UserDetailsComponent
          id={account.id}
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
            id={account.driver.id}
            address={account.driver.address}
            status={account.driver.status}
            canDriveVehicles={account.driver.canDriveVehicleTypes}
            allowance={account.driver.defaultAllowancePerDay}
            ratings={account.driver.customerRatings}
          />
        </GridWrapper>
      )}
      <GridWrapper id="RiderAccountActions">
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
      <RyogoCaption color="light">
        {t("LastLogin", {
          loginTime: moment(account.lastLogin).format(
            "MMMM Do YYYY, h:mm:ss a",
          ),
        })}
      </RyogoCaption>
    </PageWrapper>
  )
}
