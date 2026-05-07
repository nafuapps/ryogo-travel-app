import AccountDetailHeaderTabs from "@/components/header/accountDetailHeaderTabs"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { H4, Caption, CaptionGrey } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LogoutAlertButton from "@/components/buttons/logoutAlertButton"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import { UserStatusPill } from "@/components/statusPills/statusPills"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { User } from "lucide-react"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function AccountPageComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.Account")

  return (
    <PageWrapper id="AccountPage">
      <AccountDetailHeaderTabs selectedTab="Details" />
      <ContentWrapper id="AccountDetailsInfo">
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {userDetails.photoUrl ? (
                <RyogoImage
                  src={getFileUrl(userDetails.photoUrl)}
                  alt={t("Photo")}
                  imageSize="lg"
                />
              ) : (
                <RyogoIcon icon={User} size="xl" />
              )}
              <ChangeUserPhotoSheet
                userId={userDetails.id}
                agencyId={userDetails.agencyId}
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{userDetails.name}</H4>
              <Caption>{userDetails.phone}</Caption>
              <Caption>{userDetails.email}</Caption>
              <Caption>
                {moment(userDetails.createdAt).format("DD MMM YYYY")}
              </Caption>
              <UserStatusPill status={userDetails.status} />
            </div>
          </div>
          <ChangeUserNameSheet
            userId={userDetails.id}
            userName={userDetails.name}
            userRole={userDetails.userRole}
            agencyId={userDetails.agencyId}
          />
          <Link href="/dashboard/account/change-email">
            <Button variant={"outline"} className="w-full">
              {t("ChangeEmail.Title")}
            </Button>
          </Link>
          <Link href="/dashboard/account/change-password">
            <Button variant={"outline"} className="w-full">
              {t("ChangePassword.Title")}
            </Button>
          </Link>
          <LogoutAlertButton />
          <CaptionGrey>
            {t("LastLogin", {
              loginTime: moment(userDetails.lastLogin).format(
                "MMMM Do YYYY, h:mm:ss a",
              ),
            })}
          </CaptionGrey>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}
