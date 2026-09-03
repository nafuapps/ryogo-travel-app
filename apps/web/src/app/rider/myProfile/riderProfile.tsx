import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { KeyRound, Mail, User } from "lucide-react"
import { RyogoH3, RyogoCaption } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { Separator } from "@/components/ui/separator"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default async function RiderProfilePageComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Rider.MyProfile")

  return (
    <PageWrapper id="RiderProfilePage">
      <MyProfileDetailHeaderTabs selectedTab={"Account"} />
      <SectionWrapper id="RiderAccountDetailsInfo">
        <SectionRowWrapper justifyStart>
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
      <GridWrapper id="RiderAccountActions">
        <ChangeUserNameSheet
          userId={userDetails.id}
          userName={userDetails.name}
          userRole={userDetails.userRole}
          agencyId={userDetails.agencyId}
        />
        <Link href="/rider/myProfile/change-email">
          <RyogoDetailedIconButton
            label={t("ChangeEmail.Title")}
            icon={Mail}
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
          loginTime: moment(userDetails.lastLogin).format(
            "MMMM Do YYYY, h:mm:ss a",
          ),
        })}
      </RyogoCaption>
    </PageWrapper>
  )
}
