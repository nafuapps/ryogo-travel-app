import { RyogoH3, RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building, Phone } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import MyProfileDetailHeaderTabs from "@/components/header/detailHeaderTabs/myProfileHeaderTabs"
import { FindAssignedUserByDriverIdType } from "@ryogo-travel-app/api/services/user.services"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
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
      <SectionWrapper id="MyProfileAgencyDetailsInfo">
        <RyogoSmall weight="font-bold">{t("BasicInfo")}</RyogoSmall>
        <SectionRowWrapper>
          <SectionColWrapper>
            {agency.logoUrl ? (
              <RyogoImage
                src={getFileUrl(agency.logoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoIcon icon={Building} size="xl" />
            )}
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{agency.businessName}</RyogoH3>
            <RyogoCaption color="slate">{agency.businessPhone}</RyogoCaption>
            <RyogoCaption color="slate">{agency.businessEmail}</RyogoCaption>
            <RyogoCaption color="slate">{agency.businessAddress}</RyogoCaption>
            <RyogoCaption color="slate">
              {agency.location.city + ", " + agency.location.state}
            </RyogoCaption>
            <RyogoCaption color="slate">
              {moment(agency.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      {assignedUser && (
        <SectionWrapper id="AssignedUserInfo">
          <RyogoSmall weight="font-bold">{t("AssignedUserInfo")}</RyogoSmall>
          <SectionRowWrapper>
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
          </SectionRowWrapper>
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}
