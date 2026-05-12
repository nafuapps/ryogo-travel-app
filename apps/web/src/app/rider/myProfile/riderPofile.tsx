import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { getTranslations } from "next-intl/server"
import { User } from "lucide-react"
import { RyogoH3, RyogoCaption } from "@/components/typography"
import moment from "moment"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FindDriverByUserIdType } from "@ryogo-travel-app/api/services/driver.services"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import LogoutAlertButton from "@/components/buttons/alert/logoutAlertButton"
import ChangeUserNameSheet from "@/components/sheets/changeUserNameSheet"
import ChangeUserPhotoSheet from "@/components/sheets/changeUserPhotoSheet"
import { DriverStatusPill } from "@/components/statusPills/statusPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"

export default async function RiderProfilePageComponent({
  driverDetails,
}: {
  driverDetails: NonNullable<FindDriverByUserIdType>
}) {
  const t = await getTranslations("Rider.MyProfile")

  return (
    <PageWrapper id="RiderProfilePage">
      <MyProfileDetailHeaderTabs selectedTab={"Details"} />
      <SectionWrapper id="RiderAccountDetailsInfo">
        <SectionRowWrapper>
          <SectionColWrapper>
            {driverDetails.user.photoUrl ? (
              <RyogoImage
                src={getFileUrl(driverDetails.user.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="xl" />
            )}
            <ChangeUserPhotoSheet
              userId={driverDetails.userId}
              agencyId={driverDetails.agencyId}
            />
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{driverDetails.name}</RyogoH3>
            <RyogoCaption color="slate">{driverDetails.phone}</RyogoCaption>
            <RyogoCaption color="slate">
              {driverDetails.user.email}
            </RyogoCaption>
            <RyogoCaption color="slate">
              {moment(driverDetails.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            <DriverStatusPill status={driverDetails.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="RiderAccountActions">
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
      </SectionWrapper>
    </PageWrapper>
  )
}
