import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import UserDetailHeaderTabs from "@/components/header/detailHeaderTabs/userDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { MailPen, Phone } from "lucide-react"
import Link from "next/link"
import { UserRolesEnum, UserStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateUserAlertButton from "@/components/buttons/alert/inactivateUserAlertButton"
import ActivateUserAlertButton from "@/components/buttons/alert/activateUserAlertButton"
import ResetUserPasswordAlertButton from "@/components/buttons/alert/resetUserPasswordAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import {
  SectionWrapper,
  PageWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import TransferAdminAlertButton from "@/components/buttons/alert/transferAdminAlertButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import UserDetailsComponent from "@/components/flows/account/userDetailsComponent"
import UserInfoComponent from "@/components/flows/account/userInfoComponent"

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

  return (
    <PageWrapper id="UserDetailsPage">
      <UserDetailHeaderTabs selectedTab={"User"} id={user.id} />
      <GridWrapper id="AccountDetails">
        <UserInfoComponent
          id={user.id}
          photoUrl={user.photoUrl}
          name={user.name}
          status={user.status}
          lastSeen={user.lastSeen}
        />
        <UserDetailsComponent
          role={user.userRole}
          phone={user.phone}
          email={user.email}
          createdAt={user.createdAt}
          isAdmin={user.isAdmin}
        />
      </GridWrapper>
      {currentUserId !== user.id && (
        <SectionWrapper id="UserCommunication">
          <RyogoPhoneButton label={t("CallUser")} phone={user.phone} />
          <RyogoChatButton
            label={t("ChatUser.Title")}
            phone={user.phone}
            subtitle={t("ChatUser.Subtitle")}
          />
        </SectionWrapper>
      )}
      {(user.userRole !== UserRolesEnum.OWNER ||
        user.id === currentUserId ||
        isCurrentUserAdmin) && (
        <GridWrapper id="UserActions">
          <ChangeUserNameSheet
            userId={user.id}
            userName={user.name}
            userRole={user.userRole}
            agencyId={user.agencyId}
          />
          <Link href={`/dashboard/users/${user.id}/change-email`}>
            <RyogoDetailedIconButton
              label={t("ChangeEmail.Title")}
              icon={MailPen}
              subtitle={t("ChangeEmail.Subtitle")}
            />
          </Link>
          <Link href={`/dashboard/users/${user.id}/change-phone`}>
            <RyogoDetailedIconButton
              label={t("ChangePhone.Title")}
              icon={Phone}
              subtitle={t("ChangePhone.Subtitle")}
            />
          </Link>
          <ResetUserPasswordAlertButton
            userId={user.id}
            agencyId={user.agencyId}
          />
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
        </GridWrapper>
      )}
    </PageWrapper>
  )
}
