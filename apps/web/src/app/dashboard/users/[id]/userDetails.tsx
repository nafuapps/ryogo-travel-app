import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "@/components/header/userDetailHeaderTabs"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateUserAlertButton from "@/components/buttons/inactivateUserAlertButton"
import ActivateUserAlertButton from "@/components/buttons/activateUserAlertButton"
import ResetUserPasswordAlertButton from "@/components/buttons/resetUserPasswordAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { UserStatusPill } from "@/components/statusPills/statusPills"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function UserDetailsPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.UserDetails")

  return (
    <PageWrapper id="UserDetailsPage">
      <UserDetailHeaderTabs selectedTab={"Details"} id={user.id} />
      <ContentWrapper id="UserDetailsInfo">
        <div className="flex flex-row gap-3 lg:gap-4 justify-between">
          <div className="flex flex-col gap-2 lg:gap-3">
            {user.photoUrl ? (
              <RyogoImage
                src={getFileUrl(user.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoIcon icon={User} size="xl" />
            )}
            <ChangeUserPhotoSheet userId={user.id} agencyId={user.agencyId} />
          </div>
          <div className="flex flex-col gap-2 lg:gap-3 items-end">
            <RyogoH3>{user.name}</RyogoH3>
            <RyogoCaption color="slate">{user.phone}</RyogoCaption>
            <RyogoCaption color="slate">{user.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(user.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            <UserStatusPill status={user.status} />
          </div>
        </div>
        <div id="UserActions" className="flex flex-col gap-2 lg:gap-3">
          <ChangeUserNameSheet
            userId={user.id}
            userName={user.name}
            userRole={user.userRole}
            agencyId={user.agencyId}
          />
          <Link href={`/dashboard/users/${user.id}/change-email`}>
            <Button variant={"outline"} className="w-full">
              {t("ChangeEmail.Title")}
            </Button>
          </Link>
          <Link href={`/dashboard/users/${user.id}/change-phone`}>
            <Button variant={"outline"} className="w-full">
              {t("ChangePhone.Title")}
            </Button>
          </Link>
          <ResetUserPasswordAlertButton
            userId={user.id}
            agencyId={user.agencyId}
          />
          {user.status !== UserStatusEnum.INACTIVE && (
            <InactivateUserAlertButton
              userId={user.id}
              agencyId={user.agencyId}
              role={user.userRole}
            />
          )}
          {user.status === UserStatusEnum.INACTIVE && (
            <ActivateUserAlertButton
              userId={user.id}
              agencyId={user.agencyId}
              role={user.userRole}
            />
          )}
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}
