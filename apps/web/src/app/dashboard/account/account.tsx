import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getTranslations } from "next-intl/server"
import { RyogoCaption } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import { MailPen, KeyRound, Phone } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import UserInfoWrapper from "@/components/flows/account/userInfoWrapper"
import UserDetailsWrapper from "@/components/flows/account/userDetailsWrapper"

export default async function AccountPageComponent({
  account,
}: {
  account: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.Account")

  return (
    <PageWrapper id="AccountPage">
      <AccountDetailHeaderTabs selectedTab="Account" />
      <GridWrapper id="AccountDetails">
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
      <GridWrapper id="AccountActions">
        <ChangeUserNameSheet
          userId={account.id}
          userName={account.name}
          userRole={account.userRole}
          agencyId={account.agencyId}
        />
        <Link
          href="/dashboard/account/change-email"
          className="flex items-center w-full gap-2 lg:gap-3"
        >
          <RyogoDetailedIconButton
            label={t("ChangeEmail.Title")}
            icon={MailPen}
            subtitle={t("ChangeEmail.Subtitle")}
          />
        </Link>
        {account.userRole === UserRolesEnum.OWNER && (
          <Link
            href={`/dashboard/users/${account.id}/change-phone`}
            className="flex items-center w-full gap-2 lg:gap-3"
          >
            <RyogoDetailedIconButton
              label={t("ChangePhone.Title")}
              icon={Phone}
              subtitle={t("ChangePhone.Subtitle")}
            />
          </Link>
        )}
        <Link href="/dashboard/account/change-password">
          <RyogoDetailedIconButton
            label={t("ChangePassword.Title")}
            icon={KeyRound}
            subtitle={t("ChangePassword.Subtitle")}
          />
        </Link>
        <LogoutAlertButton />
      </GridWrapper>
      <RyogoCaption color="light" className="text-center">
        {t("LastLogin", {
          loginTime: moment(account.lastLogin).format(
            "MMMM Do YYYY, h:mm:ss a",
          ),
        })}
      </RyogoCaption>
    </PageWrapper>
  )
}
