import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { RyogoCaption, RyogoH3 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { CircleSmall, User } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateUserAlertButton from "@/components/buttons/alert/inactivateUserAlertButton"
import ActivateUserAlertButton from "@/components/buttons/alert/activateUserAlertButton"
import ResetUserPasswordAlertButton from "@/components/buttons/alert/resetUserPasswordAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { UserStatusPill } from "@/components/pills/ryogoPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { Separator } from "@/components/ui/separator"
import TransferAdminAlertButton from "@/components/buttons/alert/transferAdminAlertButton"
import { getOnlineStatus } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default async function UserDetailsPageComponent({
  user,
  currentUserId,
  isCurrentUserAdmin,
}: {
  user: NonNullable<FindUserDetailsByIdType>
  currentUserId: string
  isCurrentUserAdmin: boolean
}) {
  const t = await getTranslations("Dashboard.UserDetails")
  const onlineStatus = getOnlineStatus(user.lastSeen)

  return (
    <PageWrapper id="UserDetailsPage">
      <UserDetailHeaderTabs selectedTab={"User"} id={user.id} />
      <SectionWrapper id="UserDetailsInfo">
        <SectionRowWrapper>
          <SectionRowWrapper justifyStart center>
            <RyogoH3 color="brand">{user.id}</RyogoH3>
            <CopyClipboardButton label={user.id} />
          </SectionRowWrapper>
          <Tooltip disableHoverableContent>
            <TooltipTrigger className="bg-slate-50 dark:bg-slate-800 px-2 py-1.5 lg:px-2.5 lg:py-2 flex items-center justify-center gap-1 lg:gap-1.5 rounded-lg">
              <SectionRowWrapper justifyEnd small center>
                <RyogoCaption color="light">{t(onlineStatus)}</RyogoCaption>
                <RyogoIcon
                  icon={CircleSmall}
                  thick
                  size={"sm"}
                  color={
                    onlineStatus === "Away"
                      ? "yellow"
                      : onlineStatus === "Online"
                        ? "green"
                        : "light"
                  }
                />
              </SectionRowWrapper>
            </TooltipTrigger>
            <TooltipContent>
              {user.lastSeen
                ? t("LastSeen", { time: moment(user.lastSeen).fromNow() })
                : t("Offline")}
            </TooltipContent>
          </Tooltip>
        </SectionRowWrapper>
        <Separator />
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
            <RyogoCaption color="slate">
              {user.userRole.toUpperCase()} {user.isAdmin && t("Admin")}
            </RyogoCaption>
            <RyogoCaption color="slate">{user.phone}</RyogoCaption>
            <RyogoCaption color="slate">{user.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(user.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            <UserStatusPill status={user.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="UserCommunication">
        <RyogoPhoneButton label={t("CallUser")} phone={user.phone} />
        <RyogoChatButton label={t("ChatUser")} phone={user.phone} />
      </SectionWrapper>
      {(user.userRole !== UserRolesEnum.OWNER ||
        user.id === currentUserId ||
        isCurrentUserAdmin) && (
        <SectionWrapper id="UserActions">
          <ChangeUserNameSheet
            userId={user.id}
            userName={user.name}
            userRole={user.userRole}
            agencyId={user.agencyId}
          />
          <Link href={`/dashboard/users/${user.id}/change-email`}>
            <Button variant={"outline"} className="w-full">
              <RyogoCaption color="slate">
                {t("ChangeEmail.Title")}
              </RyogoCaption>
            </Button>
          </Link>
          <Link href={`/dashboard/users/${user.id}/change-phone`}>
            <Button variant={"outline"} className="w-full">
              <RyogoCaption color="slate">
                {t("ChangePhone.Title")}
              </RyogoCaption>
            </Button>
          </Link>
          <ResetUserPasswordAlertButton
            userId={user.id}
            agencyId={user.agencyId}
          />
          {user.userRole === UserRolesEnum.OWNER &&
            user.id !== currentUserId &&
            ![UserStatusEnum.NEW, UserStatusEnum.SUSPENDED].includes(
              user.status,
            ) &&
            isCurrentUserAdmin && (
              <TransferAdminAlertButton
                currentUserId={currentUserId}
                otherUserId={user.id}
                agencyId={user.agencyId}
              />
            )}
          {user.status !== UserStatusEnum.INACTIVE ? (
            <InactivateUserAlertButton
              userId={user.id}
              agencyId={user.agencyId}
              role={user.userRole}
            />
          ) : (
            <ActivateUserAlertButton
              userId={user.id}
              agencyId={user.agencyId}
              role={user.userRole}
            />
          )}
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}
