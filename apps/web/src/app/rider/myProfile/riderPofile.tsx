import { pageClassName } from "@/components/page/pageCommons"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { LucideUser } from "lucide-react"
import { H4, Caption, CaptionGrey } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import MyProfileDetailHeaderTabs from "./myProfileHeaderTabs"
import LogoutAlertButton from "@/app/dashboard/components/buttons/logoutAlertButton"
import { getDriverStatusColor } from "@/app/dashboard/components/drivers/driverCommon"
import ChangeUserNameSheet from "@/components/sheets/changeUserName/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhoto/changeUserPhotoSheet"

export default async function RiderProfilePageComponent({
  driverDetails,
}: {
  driverDetails: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.MyProfile")

  const bgColor = getDriverStatusColor(driverDetails.status)

  return (
    <div id="RiderProfilePage" className={pageClassName}>
      <MyProfileDetailHeaderTabs selectedTab={"Details"} />
      <div
        id="AccountDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 lg:gap-3 items-start">
              {driverDetails.user.photoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    src={getFileUrl(driverDetails.user.photoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 768px) 112px,128px"
                  />
                </div>
              ) : (
                <LucideUser className="size-20 lg:size-24 text-slate-400" />
              )}
              <ChangeUserPhotoSheet
                userId={driverDetails.userId}
                agencyId={driverDetails.agencyId}
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{driverDetails.name}</H4>
              <Caption>{driverDetails.phone}</Caption>
              <Caption>{driverDetails.user.email}</Caption>
              <Caption>
                {moment(driverDetails.createdAt).format("DD MMM YYYY")}
              </Caption>

              <div
                className={`flex items-center justify-center ${bgColor} rounded-full gap-1 lg:gap-1.5 px-3 py-1.5 lg:px-6 lg:py-2`}
              >
                <Caption>{driverDetails.status.toUpperCase()}</Caption>
              </div>
            </div>
          </div>
          <ChangeUserNameSheet
            userId={driverDetails.userId}
            userName={driverDetails.user.name}
            userRole={driverDetails.user.userRole}
            agencyId={driverDetails.agencyId}
          />
          <Link href="/rider/myProfile/change-email">
            <Button variant={"outline"} className="w-full">
              {t("ChangeEmail.Title")}
            </Button>
          </Link>
          <Link href="/rider/myProfile/change-password">
            <Button variant={"outline"} className="w-full">
              {t("ChangePassword.Title")}
            </Button>
          </Link>
          <LogoutAlertButton />
          <CaptionGrey>
            {t("LastLogin", {
              loginTime: moment(driverDetails.user.lastLogin).format(
                "MMMM Do YYYY, h:mm:ss a",
              ),
            })}
          </CaptionGrey>
        </div>
      </div>
    </div>
  )
}
