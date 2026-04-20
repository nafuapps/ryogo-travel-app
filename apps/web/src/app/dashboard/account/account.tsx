import { pageClassName } from "@/components/page/pageCommons"
import AccountDetailHeaderTabs from "./accountDetailHeaderTabs"
import { FindUserDetailsByIdType } from "@ryogo-travel-app/api/services/user.services"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { LucideUser } from "lucide-react"
import { H4, Caption, CaptionGrey } from "@/components/typography"
import moment from "moment"
import { getUserStatusColor } from "../components/users/userCommon"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import LogoutAlertButton from "../components/buttons/logoutAlertButton"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhoto/changeUserPhotoSheet"
import ChangeUserNameSheet from "@/components/sheets/changeUserName/changeUserNameSheet"
import { UserStatusPill } from "@/components/statusPills/statusPills"

export default async function AccountPageComponent({
  userDetails,
}: {
  userDetails: NonNullable<FindUserDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.Account")

  const bgColor = getUserStatusColor(userDetails.status)

  return (
    <div id="AccountPage" className={pageClassName}>
      <AccountDetailHeaderTabs selectedTab="Details" />
      <div
        id="AccountDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 lg:gap-3 items-start">
              {userDetails.photoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    loading="eager"
                    src={getFileUrl(userDetails.photoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 1024px) 112px,128px"
                  />
                </div>
              ) : (
                <LucideUser className="size-20 lg:size-24 text-slate-400" />
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
      </div>
    </div>
  )
}
