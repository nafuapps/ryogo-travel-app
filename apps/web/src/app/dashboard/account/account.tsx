import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { RyogoH3, RyogoCaption } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { User, Mail, KeyRound, Phone } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { Separator } from "@/components/ui/separator"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function AccountPageComponent({
  account,
}: {
  account: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.Account")

  return (
    <PageWrapper id="AccountPage">
      <AccountDetailHeaderTabs selectedTab="Account" />
      <SectionWrapper id="AccountDetailsInfo">
        <SectionRowWrapper justifyStart center>
          <RyogoH3 color="brand">{account.id}</RyogoH3>
          <CopyClipboardButton label={account.id} />
        </SectionRowWrapper>
        <Separator />
        <SectionRowWrapper>
          <SectionColWrapper>
            {account.photoUrl ? (
              <RyogoImage
                src={getFileUrl(account.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="xl" />
            )}
            <ChangeUserPhotoSheet
              userId={account.id}
              agencyId={account.agencyId}
            />
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{account.name}</RyogoH3>
            <RyogoCaption color="slate">{account.phone}</RyogoCaption>
            <RyogoCaption color="slate">{account.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(account.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            <UserStatusPill status={account.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
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
            icon={Mail}
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
