import { AgencyStatusPill } from "@/components/statusPills/statusPills"
import AccountDetailHeaderTabs from "../accountDetailHeaderTabs"
import {
  H4,
  Caption,
  CaptionRed,
  SmallBold,
  SmallGrey,
} from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideBuilding } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"
import { PageWrapper } from "@/components/page/pageWrappers"

//TODO: Add subscription link when subscription is implemented

export default async function AgencyDetailsPageComponent({
  agency,
  isOwner,
}: {
  agency: NonNullable<FindAgencyByIdType>
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.AccountAgency")

  return (
    <PageWrapper id="AccountAgencyPage">
      <AccountDetailHeaderTabs selectedTab="Agency" />
      <div
        id="AccountAgencyDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <div className="flex flex-col gap-2 lg:gap-3">
          <SmallBold>{t("BasicInfo")}</SmallBold>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 lg:gap-3 items-start">
              {agency.logoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    loading="eager"
                    src={getFileUrl(agency.logoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 1024px) 112px,128px"
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
              <AgencyStatusPill status={agency.status} />
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 lg:gap-3">
          <SmallBold>{t("SubscriptionInfo")}</SmallBold>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <SmallGrey>{agency.subscriptionPlan.toUpperCase()}</SmallGrey>
            {agency.subscriptionExpiresOn < new Date() ? (
              <CaptionRed>
                {t("ValidTill") +
                  moment(agency.subscriptionExpiresOn).format("DD MMM YYYY")}
              </CaptionRed>
            ) : (
              <Caption>
                {t("ValidTill") +
                  moment(agency.subscriptionExpiresOn).format("DD MMM YYYY")}
              </Caption>
            )}
          </div>
        </div>
        <Separator />
        {isOwner && (
          <div id="AgencyActions" className="flex flex-col gap-2 lg:gap-3">
            <Link href="/dashboard/account/agency/modify">
              <Button variant={"outline"} className="w-full">
                {t("EditDetails")}
              </Button>
            </Link>
            <Link href={`/dashboard/account/agency/change-email`}>
              <Button variant={"outline"} className="w-full">
                {t("ChangeEmail.Title")}
              </Button>
            </Link>
            <Link href={`/dashboard/account/agency/change-phone`}>
              <Button variant={"outline"} className="w-full">
                {t("ChangePhone.Title")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
