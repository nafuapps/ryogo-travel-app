import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateUserAlertButton from "@/components/buttons/alert/inactivateUserAlertButton"
import ActivateUserAlertButton from "@/components/buttons/alert/activateUserAlertButton"
import ResetUserPasswordAlertButton from "@/components/buttons/alert/resetUserPasswordAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { UserStatusPill } from "@/components/statusPills/statusPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"

export default async function UserDetailsPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.UserDetails")

  return (
    <PageWrapper id="UserDetailsPage">
      <UserDetailHeaderTabs selectedTab={"User"} id={user.id} />
      <SectionWrapper id="UserDetailsInfo">
        <SectionRowWrapper>
          <SectionColWrapper>
            {user.photoUrl ? (
              <RyogoImage
                src={getFileUrl(user.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="xl" />
            )}
            <ChangeUserPhotoSheet userId={user.id} agencyId={user.agencyId} />
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{user.name}</RyogoH3>
            <RyogoCaption color="slate">{user.phone}</RyogoCaption>
            <RyogoCaption color="slate">{user.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(user.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            <UserStatusPill status={user.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
        <SectionColWrapper>
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
        </SectionColWrapper>
      </SectionWrapper>
    </PageWrapper>
  )
}
