import { AgencyStatusPill } from "@/components/statusPills/statusPills"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { RyogoH3, RyogoCaption, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

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
      <SectionWrapper id="BasicInfo">
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
            <AgencyStatusPill status={agency.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id="SubscriptionInfo">
        <RyogoSmall weight="font-bold">{t("SubscriptionInfo")}</RyogoSmall>
        <SectionColWrapper>
          <RyogoSmall color="slate">
            {agency.subscriptionPlan.toUpperCase()}
          </RyogoSmall>
          {agency.subscriptionExpiresOn < new Date() ? (
            <RyogoCaption color="red">
              {t("ValidTill") +
                moment(agency.subscriptionExpiresOn).format("DD MMM YYYY")}
            </RyogoCaption>
          ) : (
            <RyogoCaption color="slate">
              {t("ValidTill") +
                moment(agency.subscriptionExpiresOn).format("DD MMM YYYY")}
            </RyogoCaption>
          )}
        </SectionColWrapper>
      </SectionWrapper>
      {isOwner && (
        <SectionWrapper id="AgencyActions">
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
        </SectionWrapper>
      )}
    </PageWrapper>
  )
}
