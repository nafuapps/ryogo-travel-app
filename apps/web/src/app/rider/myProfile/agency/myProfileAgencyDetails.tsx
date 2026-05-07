import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { Separator } from "@radix-ui/react-separator"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building, Phone } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import MyProfileDetailHeaderTabs from "@/components/header/myProfileHeaderTabs"
import { FindAssignedUserByDriverIdType } from "@ryogo-travel-app/api/services/user.services"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function MyProfileAgencyDetailsPageComponent({
  agency,
  assignedUser,
}: {
  agency: NonNullable<FindAgencyByIdType>
  assignedUser: FindAssignedUserByDriverIdType
}) {
  const t = await getTranslations("Rider.MyProfileAgency")

  return (
    <PageWrapper id="RiderMyProfileAgencyPage">
      <MyProfileDetailHeaderTabs selectedTab="Agency" />
      <ContentWrapper id="MyProfileAgencyDetailsInfo">
        <div className="flex flex-col gap-2 lg:gap-3">
          <RyogoSmall weight="font-bold">{t("BasicInfo")}</RyogoSmall>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {agency.logoUrl ? (
                <RyogoImage
                  src={getFileUrl(agency.logoUrl)}
                  alt={t("Photo")}
                  imageSize="lg"
                />
              ) : (
                <RyogoIcon icon={Building} size="xl" />
              )}
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <RyogoH3>{agency.businessName}</RyogoH3>
              <RyogoCaption color="slate">{agency.businessPhone}</RyogoCaption>
              <RyogoCaption color="slate">{agency.businessEmail}</RyogoCaption>
              <RyogoCaption color="slate">
                {agency.businessAddress}
              </RyogoCaption>
              <RyogoCaption color="slate">
                {agency.location.city + ", " + agency.location.state}
              </RyogoCaption>
              <RyogoCaption color="slate">
                {moment(agency.createdAt).format("DD MMM YYYY")}
              </RyogoCaption>
            </div>
          </div>
        </div>
        <Separator />
        {assignedUser && (
          <div className="flex flex-col gap-2 lg:gap-3">
            <RyogoSmall weight="font-bold">{t("AssignedUserInfo")}</RyogoSmall>
            <div className="flex flex-row gap-2 lg:gap-3 items-center justify-between">
              <RyogoSmall color="slate">{assignedUser.name}</RyogoSmall>
              <Button
                variant={"secondary"}
                className="sm:col-span-2 xl:col-span-3"
              >
                <Link
                  href={`tel:${assignedUser.phone}`}
                  className="w-full gap-2 lg:gap-3 flex flex-row items-center justify-center"
                >
                  <RyogoIcon icon={Phone} size="sm" />
                  <RyogoCaption color="light">{t("CallAgent")}</RyogoCaption>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </ContentWrapper>
    </PageWrapper>
  )
}
