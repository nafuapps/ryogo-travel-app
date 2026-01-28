import { pageClassName } from "@/components/page/pageCommons"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "./userDetailHeaderTabs"
import { Caption, H4 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideUser } from "lucide-react"
import moment from "moment"
import { getUserStatusColor } from "../../components/users/userCommon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateUserAlertButton from "../../components/buttons/inactivateUserAlertButton"
import ActivateUserAlertButton from "../../components/buttons/activateUserAlertButton"
import ResetUserPasswordAlertButton from "../../components/buttons/resetUserPasswordAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserName/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhoto/changeUserPhotoSheet"

export default async function UserDetailsPageComponent({
  user,
}: {
  user: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.UserDetails")

  const bgColor = getUserStatusColor(user.status)

  return (
    <div id="UserDetailsPage" className={pageClassName}>
      <UserDetailHeaderTabs selectedTab={"Details"} id={user.id} />
      <div
        id="UserDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
          <div className="flex flex-col gap-2 lg:gap-3 items-start">
            {user.photoUrl ? (
              <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                <Image
                  src={getFileUrl(user.photoUrl)}
                  alt={t("Photo")}
                  fill
                  sizes="(max-width: 768px) 112px,128px"
                />
              </div>
            ) : (
              <LucideUser className="size-20 lg:size-24 text-slate-400" />
            )}
            <ChangeUserPhotoSheet userId={user.id} />
          </div>
          <div className="flex flex-col gap-2 lg:gap-3 items-end">
            <H4>{user.name}</H4>
            <Caption>{user.phone}</Caption>
            <Caption>{user.email}</Caption>
            <Caption>{moment(user.createdAt).format("DD MMM YYYY")}</Caption>

            <div
              className={`flex items-center justify-center ${bgColor} rounded-full gap-1 lg:gap-1.5 px-3 py-1.5 lg:px-6 lg:py-2`}
            >
              <Caption>{user.status.toUpperCase()}</Caption>
            </div>
          </div>
        </div>
        <div id="UserActions" className="flex flex-col gap-2 lg:gap-3">
          <ChangeUserNameSheet
            userId={user.id}
            userName={user.name}
            userRole={user.userRole}
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
          <ResetUserPasswordAlertButton userId={user.id} />
          {user.status != UserStatusEnum.INACTIVE && (
            <InactivateUserAlertButton userId={user.id} role={user.userRole} />
          )}
          {user.status == UserStatusEnum.INACTIVE && (
            <ActivateUserAlertButton userId={user.id} role={user.userRole} />
          )}
        </div>
      </div>
    </div>
  )
}
