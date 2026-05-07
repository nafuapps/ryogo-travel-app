import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { User } from "lucide-react"
import { RyogoH3, RyogoCaption } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import MyProfileDetailHeaderTabs from "@/components/header/myProfileHeaderTabs"
import LogoutAlertButton from "@/components/buttons/logoutAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { DriverStatusPill } from "@/components/statusPills/statusPills"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function RiderProfilePageComponent({
  driverDetails,
}: {
  driverDetails: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.MyProfile")

  return (
    <PageWrapper id="RiderProfilePage">
      <MyProfileDetailHeaderTabs selectedTab={"Details"} />
      <ContentWrapper id="RiderAccountDetailsInfo">
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {driverDetails.user.photoUrl ? (
                <RyogoImage
                  src={getFileUrl(driverDetails.user.photoUrl)}
                  alt={t("Photo")}
                  imageSize="lg"
                />
              ) : (
                <RyogoIcon icon={User} size="xl" />
              )}
              <ChangeUserPhotoSheet
                userId={driverDetails.userId}
                agencyId={driverDetails.agencyId}
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <RyogoH3>{driverDetails.name}</RyogoH3>
              <RyogoCaption color="slate">{driverDetails.phone}</RyogoCaption>
              <RyogoCaption color="slate">
                {driverDetails.user.email}
              </RyogoCaption>
              <RyogoCaption color="slate">
                {moment(driverDetails.createdAt).format("DD MMM YYYY")}
              </RyogoCaption>
              <DriverStatusPill status={driverDetails.status} />
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
          <RyogoCaption color="light">
            {t("LastLogin", {
              loginTime: moment(driverDetails.user.lastLogin).format(
                "MMMM Do YYYY, h:mm:ss a",
              ),
            })}
          </RyogoCaption>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}
