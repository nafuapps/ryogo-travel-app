import {
  H4,
  Caption,
  SmallBold,
  SmallGrey,
  CaptionGrey,
} from "@/components/typography"
import { Separator } from "@radix-ui/react-separator"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideBuilding, LucidePhone } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import MyProfileDetailHeaderTabs from "@/components/header/myProfileHeaderTabs"
import { FindAssignedUserByDriverIdType } from "@ryogo-travel-app/api/services/user.services"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"

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
          <SmallBold>{t("BasicInfo")}</SmallBold>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {agency.logoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    loading="eager"
                    src={getFileUrl(agency.logoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 768px) 112px,128px"
                  />
                </div>
              ) : (
                <LucideBuilding className="size-20 lg:size-24 text-slate-400" />
              )}
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{agency.businessName}</H4>
              <Caption>{agency.businessPhone}</Caption>
              <Caption>{agency.businessEmail}</Caption>
              <Caption>{agency.businessAddress}</Caption>
              <Caption>
                {agency.location.city + ", " + agency.location.state}
              </Caption>
              <Caption>
                {moment(agency.createdAt).format("DD MMM YYYY")}
              </Caption>
            </div>
          </div>
        </div>
        <Separator />
        {assignedUser && (
          <div className="flex flex-col gap-2 lg:gap-3">
            <SmallBold>{t("AssignedUserInfo")}</SmallBold>
            <div className="flex flex-row gap-2 lg:gap-3 items-center justify-between">
              <SmallGrey>{assignedUser.name}</SmallGrey>
              <Button
                variant={"secondary"}
                className="sm:col-span-2 xl:col-span-3"
              >
                <Link
                  href={`tel:${assignedUser.phone}`}
                  className="w-full gap-2 lg:gap-3 flex flex-row items-center justify-center"
                >
                  <LucidePhone className="size-5 lg:size-6 text-slate-500" />
                  <CaptionGrey>{t("CallAgent")}</CaptionGrey>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </ContentWrapper>
    </PageWrapper>
  )
}
