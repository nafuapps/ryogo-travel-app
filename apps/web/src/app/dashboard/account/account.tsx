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
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { User } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { Separator } from "@/components/ui/separator"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default async function AccountPageComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.Account")

  return (
    <PageWrapper id="AccountPage">
      <AccountDetailHeaderTabs selectedTab="Account" />
      <SectionWrapper id="AccountDetailsInfo">
        <SectionRowWrapper justifyStart center>
          <RyogoH3 color="brand">{userDetails.id}</RyogoH3>
          <CopyClipboardButton label={userDetails.id} />
        </SectionRowWrapper>
        <Separator />
        <SectionRowWrapper>
          <SectionColWrapper>
            {userDetails.photoUrl ? (
              <RyogoImage
                src={getFileUrl(userDetails.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="xl" />
            )}
            <ChangeUserPhotoSheet
              userId={userDetails.id}
              agencyId={userDetails.agencyId}
            />
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{userDetails.name}</RyogoH3>
            <RyogoCaption color="slate">{userDetails.phone}</RyogoCaption>
            <RyogoCaption color="slate">{userDetails.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(userDetails.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            <UserStatusPill status={userDetails.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="AccountActions">
        <ChangeUserNameSheet
          userId={userDetails.id}
          userName={userDetails.name}
          userRole={userDetails.userRole}
          agencyId={userDetails.agencyId}
        />
        <Link href="/dashboard/account/change-email">
          <RyogoOutlineButton
            className="w-full"
            label={t("ChangeEmail.Title")}
          />
        </Link>
        <Link href="/dashboard/account/change-password">
          <RyogoOutlineButton
            className="w-full"
            label={t("ChangePassword.Title")}
          />
        </Link>
        <LogoutAlertButton />
        <RyogoCaption color="light">
          {t("LastLogin", {
            loginTime: moment(userDetails.lastLogin).format(
              "MMMM Do YYYY, h:mm:ss a",
            ),
          })}
        </RyogoCaption>
      </SectionWrapper>
    </PageWrapper>
  )
}
