// import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import AccountInfoComponent from "@/components/flows/account/accountInfoComponent"
import UserDetailsComponent from "@/components/flows/account/userDetailsComponent"
import UserLoginTimeComponent from "@/components/flows/account/userLoginTimeComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import {
  GridWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Camera, KeyRound, MailPen, Phone } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function AccountPageComponent({
  account,
  sessionLoginAt,
}: {
  account: NonNullable<FindUserDetailsByIdType>
  sessionLoginAt: Date
}) {
  const t = await getTranslations("Dashboard.Account")

  return (
    <PageWrapper id="AccountPage">
      <GridWrapper id="AccountDetails">
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
          isAdmin={account.isAdmin}
        />
      </GridWrapper>
      <GridWrapper id="AccountActions">
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
        <Link
          href="/dashboard/account/change-email"
          className="flex items-center w-full gap-2 lg:gap-3"
          prefetch={false}
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
            prefetch={false}
          >
            <RyogoDetailedIconButton
              label={t("ChangePhone.Title")}
              icon={Phone}
              subtitle={t("ChangePhone.Subtitle")}
            />
          </Link>
        )}
        <Link href="/dashboard/account/change-password" prefetch={false}>
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
        <HelpIconButton
          href={"/dashboard/support/help-account"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
