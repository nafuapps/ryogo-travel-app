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
import UserInfoWrapper from "@/components/flows/account/userInfoWrapper"
import UserDetailsWrapper from "@/components/flows/account/userDetailsWrapper"
import DriverDetailsWrapper from "@/components/flows/account/driverDetailsWrapper"
import LicenseInfoWrapper from "@/components/flows/account/licenseInfoWrapper"

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
        <UserInfoWrapper
          id={account.id}
          photoUrl={account.photoUrl}
          agencyId={account.agencyId}
          name={account.name}
          agencyName={account.agency.businessName}
          userRole={account.userRole}
        />
        <UserDetailsWrapper
          id={account.id}
          status={account.status}
          phone={account.phone}
          email={account.email}
          createdAt={account.createdAt}
        />
      </GridWrapper>
      {account.driver && (
        <GridWrapper id="RiderDriverDetails">
          <LicenseInfoWrapper
            licenseNumber={account.driver.licenseNumber}
            photoUrl={account.driver.licensePhotoUrl}
            expiryDate={account.driver.licenseExpiresOn}
          />
          <DriverDetailsWrapper
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
